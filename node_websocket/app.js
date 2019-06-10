const express = require('express');
const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const sql = require('./public/select');
const pool = require('./public/connect');
const schedule = require('node-schedule');

//view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//static
app.use('/public', express.static(__dirname + '/public')); //디렉토리 정적으로 고정하는 부분

//routing
app.get('/', function(req, res){ //index.html /로 라우팅
    console.log('home')
    res.render('home.ejs')
});

app.get('/banner/server', function(req, res){ // server.html /server로 라우팅 
    //관리자 페이지 접속 시 
    console.log('server')
    var toServer = {};
    var tmp = sql('SELECT bannerId, bannerSrc FROM bannerMatched where contractionState = 1')
    // 현재 송출 중인 배너들을 띄우는 부분
    tmp.select(function(err, data){
        if (err){
            console.log(err)
            res.render('server.ejs')
        }
        else {
            toServer['img'] = {path : data[0].path, name : data[0].name}
            res.render('server', {imgSource : toServer});
        };
        
        // sql.pool.end(function(err){
        //   if (err) console.log(err);
        //   else {
        //     console.log('** Finished');
        //   }
        // });
      });
});

app.get('/banner/:id', function(req, res){ ///banner/:id로 라우팅
    console.log('banner')
    var clientIp = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    var tmp = sql('SELECT creatorIp FROM creatorInfo')
    tmp.select(function(err, data){
        if (err){
            console.log(err)
        }
        else {
            if(data[0].creatorIp != clientIp){ //나중에 이부분 경고창으로 바꿔야 함. 등록된 아이피가 아니면 접속차단시키는 부분임
                res.render('client.ejs')    
            } else{
                res.render('client.ejs');
            }
        }
    });
});

(function(){
    var socketsInfo = {}; //클라이언트로 보낼 socketinfo 객체
    var serverId = undefined; //서버아이디 체크를 위해 생성
    io.on('connection', function(socket){
        console.log('contact') // 연결이 되면 로그 발생
        var clientId = socket.id; //socketID 획득
        var req = socket.request; // req
        var ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress; //클라이언트 ip주소 얻는 부분
        var roomInfo = socket.adapter.rooms; // 현재 웹소켓에 접속중이 room들과 그 접속자들의 정보 얻음
        var keys = Object.keys(roomInfo); //websocket 접속자 정보 
        var rule = new schedule.RecurrenceRule(); //스케쥴러 객체 생성
        rule.hour = new schedule.Range(0,23) // cronTask 시간지정
        // rule.minute = [0, 10, 20, 30, 40, 50] //cronTask 실행되는 분(minute)
        rule.second = [0, 30] // 초단위 실행 (테스트용)
        console.log(roomInfo)
        var cronTask = schedule.scheduleJob(rule, function(){ // 스케쥴러를 통해 1분마다 db에 배너정보 전송
                    if(serverId != clientId && clientId != undefined){ //해당 페이지의 클라이언트 아이디가 서버아이디와 일치하지 않고, undefined가 아니면 그건 client라는 뜻
                        socket.emit('response banner data to server', {}); //client로 emit
                        socket.emit('check bannerId', {})
                }   else if(serverId == clientId && serverId!= undefined){ // server가 접속했을떄임
                        io.to(serverId).emit('divReload', {}); //송출중인 배너 div 10분마다 리로드 (실제 송출중인 배너 체크가능)
                        // socket.emit('response banner data to server', {});
                        console.log(serverId + '새로고침완료');
                    }
                });
    
        socket.on('host', function(){ //server 접속시 발생
            keys.splice(keys.indexOf(clientId), 1) //서버의 웹소켓 아이디는 설렉트 박스에 안뜨도록 제거
            socket.emit('id receive', keys, socketsInfo); //socketInfo 객체(클라이언트 socketid와 url이 담김)랑 클라이언트 socketid 전송
            serverId = clientId; //서버아이디 생성
            console.log(socketsInfo, keys);
        });

        socket.on('new client', function(_url){ //새로운 클라이언트 접속 시 발생 
            
            // 서버에 현재 배너창 띄운 크리에이터들 전송///////
            if(serverId == undefined){ //해당페이지가 서버가 아님을 확인 
                socket.broadcast.emit('id receive', clientId);
            } else{
                io.to(serverId).emit('id receive', clientId);
            };
            /////////////////////////////////////////////////////

            console.log(`-새 접속 ip : ${ip}`)
            console.log(`클라이언트id ${ clientId }`);
            socketsInfo[Object.keys(roomInfo).pop()] = _url;
            console.log(socketsInfo); //접속중인 url 저장된 부분
        });
    
        socket.on('disconnect', function(){ //접속종료시
            delete socketsInfo[clientId] //socketsInfo에서 접속종료한 clientID 삭제
            
            if(serverId == undefined){
                socket.broadcast.emit('id remove', clientId);
            } else{
                io.to(serverId).emit('id remove', clientId);
            };

            console.log(`- ip : ${ip} :  접속종료`);
            clientId = undefined;
            clearInterval(socket.interval);
        });

        socket.on('img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('db img send', function(msg){ 
            socket.broadcast.emit('img receive', msg);
        });

        socket.on('particular img send', function(msg){ //특정 클라이언트에게만 배너 전송
            io.to(msg[0]).emit('img receive', msg[1]);
        });

        socket.on('write to db', function(msg){
            pool.getConnection(function(err, conn){
            if(err) return err;
            var sql = "INSERT INTO contractionTimestamp (contractionId) VALUES (?);"; 
            conn.query(sql, [msg[0]/*, msg[1], msg[2]*/], function (err, result, fields) { //msg[0]:bannername msg[1]:url msg[2]:category
                conn.release();
                if (err) return err;   
                });
            });   
        });

        socket.on('request img', function(msg){
            var toServer = {}; //서버로 보낼 이미지 객체 ()
            var _url = msg[0];
            var getQuery = sql(`SELECT bannerSrc, contractionId, bannerCategory
                                FROM bannerMatched AS bm 
                                JOIN bannerRegistered AS br 
                                ON bm.contractionId LIKE CONCAT('%', br.bannerId, '%') 
                                WHERE bm.contractionId LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}"),'%')
                                AND bm.contractionState = 0 
                                ORDER BY contractionTime ASC LIMIT 1;`)
            
            getQuery.select(function(err, data){
                if (err){
                    console.log(err)
                }
                else {
                    if(data.length == 0){ //계약된 거가 없을때 개인계약을 안한 광고주의 배너와 매칭
                        getQuery = sql(`SELECT bannerSrc, bannerId 
                                        FROM bannerRegistered 
                                        WHERE confirmState = 1
                                        ORDER BY date ASC LIMIT 1;`)
                        
                        getQuery.select(function(err, data){
                            if (err){
                                console.log(err)
                            }
                            else {
                                console.log('계약된 배너가 없어서 bannerRegistered의 가장 오래된 광고와 매칭')
                                toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                
                                socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                            };
                        })
                    } else {
                        if(msg[1] == data[0].bannerCategory || data[0].bannerCategory == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                           
                                console.log('계약된게 있고, 카테고리가 일치하여 정확히 매칭')
                                toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
                            
                            socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                        } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                            getQuery = sql(`SELECT bannerSrc, bannerId 
                                            FROM bannerRegistered 
                                            WHERE confirmState = 1
                                            ORDER BY date ASC LIMIT 1;`)
                            getQuery.select(function(err, data){
                                if (err){
                                    console.log(err)
                                }
                                else {
                                    console.log('계약된게 있지만, 카테고리가 일치하지 않아 bannerRegistered의 가장 오래된 광고와 매칭')  
                                    toServer['img'+index] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                    socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                                    };
                                })
                            }
                    };
                }
            })
            /*풀 닫는부분인데 나중에 에러 날까봐 일단 안지움
                sql.pool.end(function(err){
                  if (err) console.log(err);
                  else {
                    console.log('** Finished');
                  }
                });
              });
            */
        });

        socket.on('check plz', function(msg){
            // DB에서 이름가져와서 확인
            //msg0 : url msg1 : category msg2 : broadcasting banner name
            var toServer = {}; // 클라이언트로 보낼 객체
            var _url = msg[0];
            var broadcastingBannerName = msg[2] //클라이언트에 송출 중인 배너의 id
            var getQuery = sql(`SELECT contractionId, bannerCategory 
                                FROM bannerMatched AS bm  
                                JOIN bannerRegistered AS br 
                                ON bm.contractionId LIKE CONCAT('%', br.bannerId, '%') 
                                WHERE bm.contractionId LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}"),'%') 
                                AND bm.contractionState = 0 
                                ORDER BY contractionTime ASC LIMIT 1;`)
            
            getQuery.select(function(err, data){
                if (err){
                    console.log(err)
                }
                else {
                    if(data.length == 0){ //계약된 거가 없을때
                        getQuery = sql(`SELECT bannerId 
                                        FROM bannerRegistered 
                                        WHERE confirmState = 1
                                        ORDER BY date ASC LIMIT 1;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(1)
                                           
                                                toServer['img'] = {name : data[0].bannerId}
                                            
                                                if(toServer['img'].name == broadcastingBannerName){
                                                    //pass
                                                    console.log('계약된게 없고, 가장 최하위 banner도 그대로라서 이미지 호출안하고 넘어감')
                                                } else{
                                                var getQuery = sql(`SELECT bannerSrc, bannerId 
                                                                    FROM bannerRegistered 
                                                                    WHERE confirmState = 1
                                                                    ORDER BY date ASC LIMIT 1;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('계약된게 없지만, 최하위 banner가 바뀌어서 이미지 재호출 or 계약되있던 이전 배너의 state가 바뀌어서 새 이미지 호출')
                                                        
                                                        toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                                        socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                                                    };
                                                })
                                            };
                                        };
                                    })
                    } else{
                        // getQuery = sql(`SELECT bannerCategory 
                        //                     FROM bannerMatched AS bm 
                        //                             JOIN creatorInfo AS ci 
                        //                                 ON bm.creatorId = ci.creatorId 
                        //                                     WHERE ci.advertiseUrl = "${_url}" 
                        //                                         AND bm.contractionState = 0;`) //계약 된게 있을때
                        getQuery.select(function(err, data){
                            if (err){
                                console.log(err)
                            }
                            else {
                                if(msg[1] == data[0].bannerCategory || data[0].bannerCategory == 'any' ){ //계약된게 있고, 카테고리가 any거나 일치할떄
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(2)
                                            toServer['img'] = {name : data[0].contractionId}
                                            if(toServer['img'].name == broadcastingBannerName){
                                                //pass
                                                console.log('계약된게 있고, 카테고리가 any거나 일치하고, contractionState도 바뀌지 않음')
                                            } else{
                                                var getQuery = sql(`SELECT bannerSrc, contractionId
                                                                    FROM bannerMatched AS bm 
                                                                    JOIN bannerRegistered AS br 
                                                                    ON bm.contractionId LIKE CONCAT('%', br.bannerId, '%') 
                                                                    WHERE bm.contractionId LIKE CONCAT('%',(SELECT creatorId FROM creatorInfo WHERE advertiseUrl = "${_url}"),'%')
                                                                    AND bm.contractionState = 0 
                                                                    ORDER BY contractionTime ASC LIMIT 1;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('계약된게 있고, 카테고리도 맞지만, 기존광고의 contractionstate가 바뀌어 최신배너 호출')
                                                        toServer['img'] = {path : data[0].bannerSrc, name : data[0].contractionId}
                                                        socket.emit('img receive', [data[0].bannerSrc, data[0].contractionId])
                                                    };
                                                });
                                            }
                                        };
                                    })
                                } else{ //계약된게 있지만 카테고리가 일치하지 않을때
                                    getQuery = sql(`SELECT bannerId 
                                                    FROM bannerRegistered 
                                                    WHERE confirmState = 1
                                                    ORDER BY date ASC LIMIT 1;`)
                                    getQuery.select(function(err, data){
                                        if (err){
                                            console.log(err)
                                        }
                                        else {
                                            console.log(3)
                                                toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                            if(toServer['img'].name == broadcastingBannerName){
                                                //pass
                                                console.log('계약된게있지만, 카테고리가 일치하지 않음. 그 전에 송출중인 배너가 bannerId가 같아 재호출안함')
                                            } else{
                                                var getQuery = sql(`SELECT bannerSrc, bannerId 
                                                                    FROM bannerRegistered 
                                                                    WHERE confirmState = 1
                                                                    ORDER BY date ASC LIMIT 1;`)
                                                getQuery.select(function(err, data){
                                                    if (err){
                                                        console.log(err)
                                                    }
                                                    else {
                                                        console.log('계약된게있지만, 카테고리가 일치하지 않음. 그 전에 송출중인 배너가 bannerId가 달라 재호출')
                                                        toServer['img'] = {path : data[0].bannerSrc, name : data[0].bannerId}
                                                        socket.emit('img receive', [toServer['img'].path, toServer['img'].name ])
                                                    };
                                                });
                                            }
                                        };
                                    })
                                }
                            };
                        });
                    };
                }
            }) 
        });
    })
})();

http.listen(3002, function(){
    console.log('connected!');
});
