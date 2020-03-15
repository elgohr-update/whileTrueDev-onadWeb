const textSource = {
  heroSector: {
    creator: {
      text: {
        title: '내 방송에 배너광고를 송출하세요',
        content: '온애드는 선별된 배너 컨텐츠를 보유하고 있습니다. 방송 컨텐츠에\n적합한 배너를 손쉽게 내 방송에 송출할 수 있습니다.\n더불어 추가수익의 기회까지?'
      },
    },
    marketer: {
      text: {
        title: '광고 노출량만큼만 지불하시면 됩니다',
        content: '온애드는 노출량 만큼의 요금만 받습니다. 예산이 초과할 우려도,\n다른 업체와의 광고비용이 궁금해하실 필요도 없습니다.\n노출량 분석시스템으로 노출량에 비례한 금액만 지불하십시오.'
      }
    },
    backImage: '/pngs/main/mainImage.jpg',
    creatorList: {
      title: 'OnAD와 함께하는 크리에이터입니다',
      content: 'OnAD와 함께하는 크리에이터입니다. 관심있는 크리에이터를 클릭하여 자세히 알아보세요.\n현재 방송중인 크리에이터는 LIVE로 표시되어 있습니다.\n수많은 크리에이터분들이 방송중이군요!'
    }
  },
  creator: {
    secondSector: {
      firstContent: '계약서를 읽으시고\n동의해주세요\n온애드와 함께합니다',
      secondContent: '[내 광고페이지]로\n이동하여 랜딩페이지\n를 설정해주세요',
      thirdContent: 'X-Split, OBS로 \n자신의 광고 URL을 입력하여\n사용하실 수 있습니다',
      fourthContent: '광고로 인한 수익금을\n신청을 통해\n 정산받으세요.',
    },
  },
  marketer: {
    secondSector: {
      firstContent: '준비된 배너와\nURL을 등록하고\n관리자 승인을 받으세요',
      secondContent: '승인된 배너, URL과\n함께 광고송출형태 설정하여\n캠페인을 생성하세요',
      thirdContent: '나의 배너가 어떤 방송에서\n얼마나 노출되었는지\n수치로 확인하세요',
      fourthContent: '세금계산서가 필요하신 경우\n사업자등록증만\n업로드 해주세요',
    },
  },
  questionMarketer: [
    { id: 'one', text: '온애드에서 진행가능한 광고 유형은 무엇인가요?' },
    { id: 'two', text: '온애드와 계약된 크리에이터를 확인하고 싶어요' },
    { id: 'three', text: '어떤 광고 카테고리가 온애드 광고에 잘 어울리나요?' },
    { id: 'four', text: '특정 컨텐츠나 크리에이터를 지정하여 배너 광고를 진행할 수 있을까요?' },
    { id: 'five', text: '트위치 이외에 다른 플랫폼에서도 온애드 광고를 진행할 수 있나요?' }
  ],
  answerMarketer: {
    one: `현재 온애드에서 진행할 수 있는 광고 유형은 크게 두 가지입니다.
    \n 1) 배너 노출 광고 (CPM)
    \n온애드와 계약된 크리에이터 생방송 화면에 배너 광고가 동시 송출됩니다.
    \nGIF, JPG, PNG의 배너 형식을 지원하며 배너 권장 사이즈는 320px * 160px 입니다.
    \n과금 기준 : 시청자 수 기준 2000 CPM으로 1000회 노출당 2000원
    \n2) 배너 클릭 광고 (CPC) 
    크리에이터가 개인방송국(채널)에 개인 광고페이지 링크를 업로드합니다. 실시간 방송에서 광고 배너를 본 시청자가 광고 페이지에 접속하여 해당 배너를 클릭하면 랜딩 페이지로 유입됩니다
    과금 기준 : 100 CPC (1회 클릭당 100원)
    \n광고 효과 및 효율성을 위해 ‘배너 노출 광고 (CPC)’와 ‘배너 클릭 광고 (CPC)’를 함께 함께 진행하시길 권장하나, CPM 또는 CPC 단독으로도 진행할 수 있습니다.
    보다 더 자세한 사항은 온애드로 문의해주시길 바랍니다. 📞
    `,
    two: '현재 온애드와 계약된 크리에이터는 홈페이지 상단의 [크리에이터 리스트]로 접속하시면 바로 확인하실 수 있습니다!',
    three: `트위치 플랫폼의 온라인 방송 시청자의 성비는 남성 82%, 여성 18%이며 10대~30대 연령의 비중이 높습니다. 따라서 온애드로 남성 대상 타겟팅에 최적화된 마케팅을 진행할 수 있습니다. 
    \n특히 남성의 제품 광고 관심도가 높은 치킨 등 요식업, 게임, 전자기기, 스포츠용품, 차량
    남성 의류, 자취/생활용품, 게이밍 기어 등이 온애드와 잘 어울리는 광고 카테고리라고 볼 수 있습니다. 
    `,
    four: '가능합니다! 광고 캠페인 생성 시 광고 송출 유형을 선택하실 수 있습니다. 마음에 드는 크리에이터, 게임 등을 골라 광고를 진행해보세요. 😊 ',
    five: '아쉽지만 현재 트위치 플랫폼에서만 진행이 가능합니다. 다만 유튜브 플랫폼 서비스도 꾸준히 개발 중이니 조금만 기다려주세요! 🛠️',
  },
  questionCreator: [
    { id: 'one', text: '온애드 가입 조건은 어떻게 되나요?' },
    { id: 'two', text: '어떻게 광고 수익을 얻을 수 있나요?' },
    { id: 'three', text: '온애드 배너를 송출하면서 지켜야할 점이 있나요?' },
    { id: 'four', text: '광고 수익금은 어떻게 출금하나요?' },
    { id: 'five', text: '방송 화면에 배너가 노출되지 않아요!' }
  ],
  answerCreator: {
    one: '온애드는 1인 방송을 사랑하는 누구에게나 열려있습니다! 트위치 플랫폼에서 개인 방송을 진행하고 있다면 누구든지 가입이 가능합니다. 지금 트위치 계정을 통해 온애드에 가입해보세요😉',
    two: `온애드에서 크리에이터님과 함께 진행할 수 있는 광고는 크게 두 가지입니다.
    \n1) 배너 노출 광고
    \n온애드 오버레이를 이용하여 개인 방송 화면에 배너 광고를 함께 송출하세요. 방송을 진행하면서 배너를 노출하면 시청자 수에 따라 수익이 발생합니다.
    \n2) 배너 클릭 광고
    \n온애드와 계약한 크리에이터에게 개인 광고 페이지를 부여해드립니다. 광고 페이지에 접속한 시청자가 배너 광고를 클릭하면 수익이 발생합니다.
    `,
    three: `
    방송 중 배너를 송출하는 크리에이터 여러분은 꼭 배너 규정을 준수하셔야 합니다. 배너 규정을 위반할 시 배너 송출과 관련한 적립금이 무효화될 수 있습니다.
    \n다음은 대표적인 배너 규정 위반 사례입니다.
    \n- 배너 사이즈를 임의로 줄이거나 온애드 오버레이를 켜두고 방송 화면에 노출하지 않는 경우
    \n- 배너를 투명하게 만들거나 다른 오버레이에 배너를 가리는 경우
    \n- 다른 배너와 번갈아 가며 노출하는 경우
    \n- 방송 진행상 배너 노출을 잠시 중단하나 온애드 배너 오버레이를 종료하지 않는 경우
    \n이외에도 비정상적인 배너 송출로 광고 수익을 취득할 경우 ‘서비스 이용약관 12항 4조’에 따라 수익금이 무효화되거나 온애드 서비스 이용이 제한됩니다.

    `,
    four: `광고를 통해 얻은 수익금이 3만원 이상이면 언제든 출금 신청이 가능합니다.
    \n출금 신청된 금액은 신청한 달의 다음 달 (익월) 10일에 등록한 계좌로 입금됩니다.    
    `,
    five: `오버레이를 올바르게 설정했으나 배너가 노출되지 않는다면 다음 과정을 따라해보세요.
    \n온애드 홈페이지 로그인 후 대시보드로 이동합니다. 대시보드 좌측 하단에 ‘현재 송출중인 배너’를 확인하세요. 만약 ‘현재 송출중인 배너가 없습니다.’라는 문구가 보인다면 현재 매칭된 배너 광고가 없다는 것을 의미합니다. 해당 문구는 광고주의 크리에이터 지정, 광고 캠페인 on/off, 광고 예산 소진 등 다양한 이유로 나타납니다. 새로운 배너가 매칭될 때까지 조금만 더 기다려주세요. 😊
    \n만약 매칭된 배너가 있음에도 배너가 송출되지 않는다면 고객센터로 문의주시길 바랍니다.   
    `,
  }
};

export default textSource;
