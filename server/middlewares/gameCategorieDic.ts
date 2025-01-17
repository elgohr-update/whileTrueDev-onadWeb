// 해당 dict은 게임 Id - 카테고리 Id list를 매칭하는 사전.
// 사전에 조사된 gameId 에 따른 카테고리 분류 파일에 따라 사전을 정의한다.
// categoryId 14번은 무관으로, 노출우선형에 해당하는 카테고리가 들어간다.

// 1	PC게임
// 2	모바일게임
// 3	고전
// 4	과학/기술
// 5	동물
// 6	소통
// 7	스포츠
// 8	야외방송/여행
// 9	음악/연주
// 10	자동차
// 11	제작/건설
// 12	키즈
// 13	성인
// 14	무관
interface GameDict {
  default: [14];
  [gameId: number]: number[];
}

const gameDict: GameDict = {
  default: [14],
  21779: [1, 6],
  0: [6],
  743: [1, 2],
  513009: [1],
  493959: [1, 13],
  495961: [1],
  460619: [1, 12],
  508708: [1],
  490292: [1, 13],
  506104: [1, 7],
  496349: [1, 7],
  493021: [1, 7],
  418073: [1, 7],
  489609: [1, 7],
  476388: [1, 7],
  114674: [1, 7],
  5757: [1, 7],
  25665: [1, 7],
  512371: [1, 7],
  33870: [1, 7],
  22833: [1, 7],
  6082: [1, 7],
  26826: [1, 7],
  3860: [1, 7],
  15204: [1, 7],
  6495: [1, 7],
  9949: [1, 7],
  19508: [1, 7],
  18931: [1, 7],
  15073: [1, 7],
  24308: [1, 7],
  7949: [1, 7],
  30493: [1, 7],
  4129: [1, 7],
  10936: [1, 7],
  1133: [1, 7],
  16203: [1, 7],
  12844: [1, 7],
  512959: [1, 7],
  14656: [1, 7],
  7065: [1, 7],
  8085: [1, 7],
  11901: [1, 7],
  509577: [1, 3],
  15134: [1, 3],
  138586: [1, 3],
  20743: [1, 3],
  20740: [1, 3],
  30119: [1, 3],
  18008: [1, 3],
  18404: [1, 3],
  16067: [1, 3],
  295: [1, 3],
  66067: [1, 3],
  10107: [1, 3],
  1183: [1, 3],
  17054: [1, 3],
  16558: [1, 3],
  18073: [1, 3],
  8901: [1, 13],
  19801: [1, 13],
  488615: [1, 3, 13],
  313164: [1, 3, 13],
  500689: [1, 3, 13],
  1005: [1, 3, 13],
  1150: [1, 3, 13],
  1476: [1, 3, 13],
  7479: [1, 3, 13],
  10431: [1, 3, 13],
  18701: [1, 3, 13],
  500546: [1, 3, 13],
  28959: [1, 3, 13],
  65810: [1, 3, 13],
  7950: [1, 3, 13],
  10234: [1, 3, 13],
  1137: [1, 3, 13],
  11501: [1, 3, 13],
  8918: [1, 3, 13],
  20307: [1, 3, 13],
  91833: [1, 3, 13],
  25675: [1, 3, 13],
  19149: [1, 3, 13],
  495053: [1, 3, 13],
  8536: [1, 3, 13],
  233: [1, 3, 13],
  1221: [1, 3, 13],
  25674: [1, 3, 13],
  369450: [1, 3, 13],
  19962: [1, 3, 13],
  17526: [1, 3, 13],
  6096: [1, 3, 13],
  10837: [1, 3, 13],
  17838: [1, 3, 13],
  3440: [1, 3, 13],
  4354: [1, 3, 13],
  11160: [1, 3, 13],
  15435: [1, 3, 13],
  18842: [1, 3, 13],
  13685: [1, 3, 13],
  10084: [1, 3, 13],
  20249: [1, 3, 13],
  498964: [1, 3, 13],
  460929: [1, 3, 13],
  7047: [1, 3, 13],
  18947: [1, 3, 13],
  18948: [1, 3, 13],
  31707: [1, 3, 13],
  33259: [1, 3, 13],
  18951: [1, 3, 13],
  28951: [1, 3, 13],
  461067: [1, 3, 13],
  491278: [1, 3, 13],
  29448: [1, 3, 13],
  9322: [1, 3, 13],
  10266: [1, 3, 13],
  9530: [1, 3, 13],
  17190: [1, 3, 13],
  18912: [1, 3, 13],
  9248: [1, 3, 13],
  10657: [1, 3, 13],
  13474: [1, 3, 13],
  2981: [1, 3, 13],
  21606: [1, 3, 13],
  508262: [1, 3, 13],
  126345: [1, 3, 13],
  32277: [1, 3, 13],
  28438: [1, 3, 13],
  506747: [1, 3, 13],
  490608: [1, 12],
  1229: [1, 12],
  2692: [1, 12],
  493997: [1, 12],
  6737: [1, 12],
  24239: [1, 12],
  14766: [1, 12],
  369590: [1, 12],
  6086: [1, 12],
  506454: [1, 12],
  2635: [1, 12],
  31905: [1, 12],
  509508: [1, 12],
  9455: [1, 12],
  24238: [1, 12],
  17470: [1, 12],
  18146: [1, 12],
  7534: [1, 12],
  11456: [1, 12],
  13243: [1, 12],
  503: [1, 12],
  22812: [1, 12],
  8195: [1, 12],
  19147: [1, 12],
  30826: [1, 12],
  6780: [1, 12],
  16982: [1, 12],
  6690: [1, 12],
  493175: [1, 12],
  18963: [1, 12],
  22810: [1, 12],
  11440: [1, 12],
  10110: [1, 12],
  4776: [1, 12],
  34158: [1, 12],
  17608: [1, 12],
  6909: [1, 12],
  494170: [1, 12],
  18257: [1, 12],
  22809: [1, 12],
  507040: [1, 12],
  110754: [1, 12],
  488924: [1, 12],
  22288: [1, 12],
  28826: [1, 12],
  27014: [1, 12],
  27013: [1, 12],
  510056: [2],
  417752: [4, 6],
  12924: [1, 11],
  11549: [1, 11],
  18381: [1, 11],
  10850: [1, 11],
  8915: [1, 11],
  24607: [1, 11],
  510148: [1, 11],
  18367: [1, 11],
  19414: [1, 11],
  66170: [1, 13],
  504462: [1, 13],
  489401: [1, 13],
  34134: [1, 13],
  494155: [1, 13],
  23894: [1, 13],
  496712: [1, 13],
  118200: [1, 13],
  31551: [1, 13],
  2162: [1, 13],
  417973: [1, 13],
  19006: [1, 13],
  491437: [1, 13],
  1964: [1, 13],
  1494: [1, 13],
  26374: [1, 13],
  65801: [1, 13],
  11609: [1, 13],
  6887: [1, 13],
  2976: [1, 13],
  15320: [1, 13],
  26355: [1, 13],
  66255: [1, 13],
  494199: [1, 13],
  22175: [1, 13],
  27192: [1, 13],
  65951: [1, 13],
  24951: [1, 13],
  9604: [1, 13],
  7176: [1, 13],
  488610: [1, 13],
  512710: [1, 13],
  512709: [1, 13],
  490788: [1, 13],
  512818: [1, 13],
  502914: [1, 12],
  9435: [1, 12],
  12482: [1, 12],
  11557: [1, 12],
  16967: [1, 12],
  110758: [1, 12],
  7335: [1, 12],
  5635: [1, 12],
  10979: [1, 12],
  24324: [1, 12],
  5406: [1, 12],
  28613: [1, 12],
  15849: [1, 12],
  8144: [1, 12],
  491327: [1, 12],
  488533: [1, 12],
  368205: [1, 12],
  7200: [1, 12],
  17828: [1, 12],
  490388: [1, 12],
  3337: [1, 12],
  369088: [1, 12],
  31498: [1, 12],
  23195: [1, 12],
  3359: [1, 12],
  33253: [1, 12],
  12954: [1, 12],
  511968: [1, 12],
  512998: [1, 12],
  491871: [1, 12],
  490868: [1, 13],
  18808: [1, 13],
  5126: [1, 13],
  1468: [1, 13],
  8645: [1, 13],
  33437: [1, 13],
  7948: [1, 13],
  9348: [1, 13],
  9402: [1, 13],
  13961: [1, 13],
  28576: [1, 13],
  461522: [1, 13],
  490571: [1, 13],
  492035: [1, 13],
  492934: [1, 13],
  489721: [1, 13],
  5360: [1, 13],
  10517: [1, 13],
  535: [1, 13],
  7690: [1, 13],
  31054: [1, 13],
  498150: [1, 13],
  14528: [1, 13],
  352: [1, 13],
  31051: [1, 13],
  14406: [1, 13],
  23110: [1, 13],
  11762: [1, 13],
  12789: [1, 13],
  29526: [1, 13],
  23873: [1, 13],
  33826: [1, 13],
  33041: [1, 13],
  23569: [1, 13],
  31151: [1, 13],
  502732: [1],
  27546: [1],
  499551: [1],
  140035: [1],
  489156: [1],
  509673: [6, 11],
  509670: [4, 6],
  510146: [1, 7],
  500008: [1, 7],
  494100: [1, 7],
  491996: [1, 7],
  493054: [1, 7],
  506316: [1, 7],
  13755: [1, 7],
  15075: [1, 7],
  497350: [1, 7],
  19435: [1, 7],
  1673: [1, 7],
  489607: [1, 7],
  18444: [1, 7],
  460318: [1, 7],
  12964: [1, 7],
  511768: [1, 7],
  17105: [1, 7],
  16710: [1, 7],
  12922: [1, 7],
  10742: [1, 7],
  2281: [1, 7],
  7054: [1, 7],
  30300: [1, 7],
  6328: [1, 7],
  10210: [1, 7],
  16972: [1, 7],
  17801: [1, 7],
  13881: [1, 7],
  7122: [1, 7],
  17269: [1, 7],
  7351: [1, 7],
  24407: [1, 7],
  10893: [1, 7],
  22126: [1, 7],
  20268: [1, 7],
  4573: [1, 7],
  2556: [1, 7],
  14241: [1, 7],
  27339: [1, 7],
  17708: [1, 7],
  811: [1, 7],
  323193: [1, 7],
  4994: [1, 7],
  28344: [1, 7],
  4785: [1, 7],
  827: [1, 7],
  1084: [1, 7],
  513170: [1, 7],
  2237: [1, 7],
  6359: [1, 7],
  19833: [1, 7],
  33746: [1, 7],
  508156: [1, 7],
  17768: [1, 7],
  13580: [1, 7],
  22392: [1, 7],
  23910: [1, 7],
  20099: [1, 7],
  7043: [1, 7],
  9735: [1, 7],
  8281: [1, 7],
  4885: [1, 7],
  505884: [2, 13],
  65632: [1, 13],
  490021: [1, 13],
  32502: [1],
  512226: [1],
  506127: [1],
  21465: [1, 9],
  6436: [1, 9],
  27234: [1, 9],
  243: [1, 9],
  514858: [2, 6],
  18122: [1],
  33214: [1, 2, 12],
  32982: [1, 8, 13],
  18707: [1, 8, 13],
  6521: [1, 8, 13],
  3412: [1, 8, 13],
  15631: [1, 8, 13],
  6167: [1, 8, 13],
  12453: [1, 8, 13],
  24057: [1, 8, 13],
  9726: [1, 8, 13],
  9423: [1, 8, 13],
  7600: [1, 8, 13],
  19268: [1, 8, 13],
  458508: [1, 8, 13],
  3235: [1, 8, 13],
  506103: [1, 7],
  504798: [1, 7],
  493091: [1, 7],
  495589: [1, 7],
  32443: [1, 7],
  489608: [1, 7],
  369095: [1, 7],
  496320: [1, 7],
  460402: [1, 7],
  66002: [1, 7],
  8408: [1, 7],
  10285: [1, 7],
  26486: [1, 7],
  14015: [1, 7],
  28500: [1, 7],
  24123: [1, 7],
  491191: [1, 7],
  17012: [1, 7],
  22532: [1, 7],
  19207: [1, 7],
  14628: [1, 7],
  8454: [1, 7],
  8791: [1, 7],
  31304: [1, 7],
  417803: [1, 7],
  26339: [1, 7],
  9482: [1, 7],
  29610: [1, 7],
  26950: [1, 7],
  27333: [1, 7],
  17722: [1, 7],
  11839: [1, 7],
  9988: [1, 7],
  13321: [1, 7],
  5739: [1, 7],
  42: [1, 7],
  3107: [1, 7],
  83070: [1, 7],
  26340: [1, 7],
  512804: [1, 7],
  1638: [1, 7],
  3805: [1, 7],
  503732: [1, 7],
  5137: [1, 7],
  415872: [1, 7],
  3430: [1, 7],
  13439: [1, 7],
  24408: [1, 7],
  34033: [1, 7],
  18990: [1, 7],
  32399: [1, 13],
  10710: [1, 13],
  10407: [1, 13],
  83071: [1, 13],
  5250: [1, 13],
  488366: [1, 13],
  495359: [1, 13],
  29288: [1, 13],
  25669: [1, 13],
  493057: [1, 13],
  460630: [1, 13],
  7228: [1, 13],
  3254: [1, 13],
  1444: [1, 13],
  1821: [1, 13],
  65711: [1, 13],
  14748: [1, 13],
  17044: [1, 13],
  65805: [1, 13],
  20821: [1, 13],
  7998: [1, 13],
  17695: [1, 13],
  20824: [1, 13],
  10317: [1, 13],
  513004: [1, 13],
  10435: [1, 13],
  12480: [1, 13],
  14440: [1, 13],
  16045: [1, 13],
  29595: [1],
  506383: [1, 7],
  495056: [1, 7],
  505563: [1, 7],
  459445: [1, 7],
  489812: [1, 7],
  493112: [1, 7],
  369306: [1, 7],
  65802: [1, 7],
  19555: [1, 7],
  24310: [1, 7],
  6256: [1, 7],
  28310: [1, 7],
  494353: [1, 7],
  696: [1, 7],
  25144: [1, 7],
  19097: [1, 7],
  31903: [1, 7],
  1280: [1, 7],
  9470: [1, 7],
  19469: [1, 7],
  15482: [1, 7],
  513319: [1, 7],
  9024: [1, 7],
  138585: [1, 2, 6],
  511224: [1, 13],
  27471: [1, 2, 4, 6, 11, 12],
  490130: [1, 2, 4, 6, 11, 12],
  497348: [1, 2, 4, 6, 11, 12],
  509725: [1, 2, 4, 6, 11, 12],
  512663: [1, 2, 4, 6, 11, 12],
  491931: [1],
  488552: [1],
  65654: [1, 13],
  512515: [1, 13],
  32345: [1, 13],
  18734: [1, 13],
  488773: [1, 13],
  460041: [1, 13],
  458778: [1, 13],
  491318: [1, 13],
  75791: [1, 13],
  499537: [1, 5, 6, 12],
  491487: [1, 13],
  513143: [1, 6],
  498566: [1, 2, 13],
  504461: [1, 12],
  16282: [1, 12],
  18833: [1, 12],
  17516: [1, 12],
  488353: [1, 12],
  489023: [1, 12],
  488354: [1, 12],
  26936: [6, 9],
  497057: [1, 13],
  496233: [1, 13],
  503805: [1, 13],
  33539: [1, 11, 12],
  459931: [1],
  497467: [1],
  32959: [1],
  490287: [1, 3, 12],
  15538: [1, 3, 12],
  500560: [1, 3, 12],
  4815: [1, 3, 12],
  1124: [1, 3, 12],
  8676: [1, 3, 12],
  17743: [1, 3, 12],
  14998: [1, 3, 12],
  12105: [1, 3, 12],
  17587: [1, 3, 12],
  12870: [1, 3, 12],
  13860: [1, 3, 12],
  18519: [1, 3, 12],
  18476: [1, 3, 12],
  4133: [1, 3, 12],
  4682: [1, 3, 12],
  1355: [1, 3, 12],
  18114: [1, 3, 12],
  505449: [1, 3, 12],
  8230: [1, 3, 12],
  497332: [1, 3, 12],
  15104: [1, 3, 12],
  7240: [1, 3, 12],
  1497: [1, 3, 12],
  17757: [1, 3, 12],
  18680: [1, 3, 12],
  7457: [1, 3, 12],
  6761: [1, 3, 12],
  7542: [1, 3, 12],
  12446: [1, 3, 12],
  26529: [1, 3, 12],
  19151: [1, 3, 12],
  10937: [1, 3, 12],
  4364: [1, 3, 12],
  12504: [1, 3, 12],
  13346: [1, 3, 12],
  505450: [1, 3, 12],
  26390: [1, 3, 12],
  2510: [1, 3, 12],
  5631: [1, 3, 12],
  12128: [1, 3, 12],
  518: [1, 3, 12],
  15116: [1, 3, 12],
  3108: [1, 3, 12],
  7325: [1, 3, 12],
  14165: [1, 3, 12],
  18770: [1, 3, 12],
  10186: [1, 3, 12],
  1350: [1, 3, 12],
  19495: [1, 3, 12],
  11522: [1, 3, 12],
  9753: [1, 3, 12],
  8711: [1, 3, 12],
  5831: [1, 3, 12],
  1288: [1, 3, 12],
  15713: [1, 3, 12],
  416185: [1, 3, 12],
  26840: [1, 3, 12],
  10551: [1, 3, 12],
  9009: [1, 3, 12],
  19573: [1, 3, 12],
  20752: [1, 3, 12],
  22583: [1, 3, 12],
  31321: [1, 3, 12],
  2878: [1, 3, 12],
  28127: [1, 3, 12],
  514047: [1, 3, 12],
  28898: [1, 3, 12],
  16582: [1, 13],
  18893: [1, 13],
  91419: [1, 13],
  14805: [1, 13],
  11386: [1, 13],
  19720: [1, 13],
  8793: [1, 13],
  67834: [1, 13],
  505278: [1, 13],
  9427: [1, 13],
  24226: [1, 13],
  13354: [1, 13],
  369140: [1, 13],
  31867: [1, 13],
  8027: [1, 13],
  17487: [1, 13],
  30874: [1, 13],
  66138: [1, 13],
  28575: [1, 13],
  20853: [1, 13],
  2813: [1, 13],
  26420: [1, 13],
  509511: [1, 12],
  490377: [1, 12],
  489635: [1, 4, 8],
  512693: [1, 6],
  369252: [1, 5, 6, 11, 12],
  18814: [1, 5, 6, 11, 12],
  2274: [1, 5, 6, 11, 12],
  32175: [1, 5, 6, 11, 12],
  492747: [1, 5, 6, 11, 12],
  9817: [1, 5, 6, 11, 12],
  16027: [1, 5, 6, 11, 12],
  24950: [1, 5, 6, 11, 12],
  31872: [1, 5, 6, 11, 12],
  66140: [1, 5, 6, 11, 12],
  20349: [1, 5, 6, 11, 12],
  5735: [1, 5, 6, 11, 12],
  28922: [1, 5, 6, 11, 12],
  20847: [1, 5, 6, 11, 12],
  3260: [1, 5, 6, 11, 12],
  67484: [1, 5, 6, 11, 12],
  12883: [1, 5, 6, 11, 12],
  370463: [1, 5, 6, 11, 12],
  29036: [1, 5, 6, 11, 12],
  14847: [1, 5, 6, 11, 12],
  20587: [1, 5, 6, 11, 12],
  24700: [1, 5, 6, 11, 12],
  7768: [1, 5, 6, 11, 12],
  103836: [1, 5, 6, 11, 12],
  503981: [1, 5, 6, 11, 12],
  16713: [1, 5, 6, 11, 12],
  14147: [1, 5, 6, 11, 12],
  9359: [1, 5, 6, 11, 12],
  313015: [1, 5, 6, 11, 12],
  905: [1, 5, 6, 11, 12],
  27201: [1, 5, 6, 11, 12],
  31175: [1, 5, 6, 11, 12],
  18383: [1, 5, 6, 11, 12],
  21949: [1, 5, 6, 11, 12],
  16343: [1, 5, 6, 11, 12],
  9035: [1, 5, 6, 11, 12],
  2565: [1, 5, 6, 11, 12],
  20417: [1, 5, 6, 11, 12],
  9844: [1, 5, 6, 11, 12],
  1531: [1, 5, 6, 11, 12],
  1269: [1, 5, 6, 11, 12],
  31887: [1, 5, 6, 11, 12],
  7955: [1, 5, 6, 11, 12],
  33197: [1, 5, 6, 11, 12],
  66349: [1, 5, 6, 11, 12],
  34031: [1, 5, 6, 11, 12],
  271231: [1],
  509659: [6, 9],
  16951: [1, 3],
  506407: [1, 13],
  2748: [3],
  29307: [1],
  511399: [1, 2, 11, 12],
  30921: [1, 7, 10, 12],
  509660: [6, 11],
  32507: [1],
  488190: [1, 2, 13],
  263490: [1, 4, 6, 11],
  19619: [1, 3],
  24241: [1],
  506462: [1, 4],
  27284: [1, 3],
  6855: [1, 3, 12],
  512186: [1, 12],
  14304: [1],
  5620: [1, 12],
  386821: [1],
  499003: [1, 2, 4, 6],
  509672: [7, 8],
  71375: [1, 4],
  509658: [6, 8, 9],
  490422: [1, 11],
  11989: [1, 11],
  3315: [1, 11, 6],
  66082: [1, 14],
  488634: [1, 4, 11],
  511212: [1, 4, 5, 8],
  510825: [1],
  313558: [1],
  24623: [1, 4], // MechWarrior Online
  19976: [1, 3, 12, ], // MapleStory
  75467: [1, 10, 4], // Euro Truck Simulator 2
  491334: [1, 7, 10], // Kartrider
  115977: [1, 13, 5, 6], // The Witcher 3: Wild Hunt
  499463: [1, 14], // Getting Over It
  66366: [1, 4, ], // War Thunder
  503116: [1, 9], // Beat Saber
  7022: [1, ], // The Forest
  65663: [1, 11, 4], // Company of Heroes 2
  73586: [1, ], // Outlast
  461389: [1, 6, 8, 12, 11], // Life Is Strange
  370539: [1, 12, 6], // Puyo Puyo Tetris
  20501: [1, 3, 6], // Mabinogi
  458634: [1, ], // Cyphers Online
  497985: [2, 6, 13], // Lineage M
  492971: [1, ], // Tricky Towers
  490537: [1, ], // Layers of Fear
  512070: [1, ], // Jump King
  512341: [1, ], // Planet Zoo
  512811: [1, 8], // Otaku's Adventure
  514193: [1, 4, 11], // Ratropolis
  515314: [1, ], // World Flipper
  497451: [5, 6, 7, 12], // Pokémon Sword/Shield
  24193: [1, ], // Left 4 Dead 2
};

const categories = {
  action: '액션격투게임 대전형액션게임 대전형격투게임 진행형격투게임 플랫폼게임 합앤밥 건앤런 텀블팝 슈팅게임 1인칭슈팅게임 3인칭슈팅게임 전략슈팅게임 MMOFPS',
  actionAdventure: '군사게임 서바이벌호러 스텔스게임 시뮬레이션어드벤처게임',
  adventure: '그래픽 어드벤처 게임 탈출 게임인터랙티브 픽션인터랙티브 무비비주얼 노벨사운드 노벨',
  rolePlaying: '액션 롤플레잉 게임다중사용자온라인롤플레잉게임(MORPG) 대규모다중사용자온라인롤플레잉게임(MMORPG) MUD 로그라이크게임 전략롤플레잉게임 시뮬레이션롤플레잉게임',
  simulation: '건설경영시뮬레이션게임 생활시뮬레이션게임 육성시뮬레이션 게임기차시뮬레이션 비행시뮬레이션 전투비행시뮬레이션 레이싱게임 우주비행시뮬레이션 잠수함시뮬레이션 자동차전투게임 걷는시뮬레이션',
  strategyTactics: '4X 대포게임 전략게임 턴제전략게임 실시간전략게임 타워디펜스 멀티플레이어온라인배틀아레나 대규모다중사용자온라인실시간전략게임(MMORTS) 전술게임 턴제전술게임 실시간전술게임 전쟁게임',
  character: '에로게임 연애게임 연애어드벤처게임 연애시뮬레이션게임',
  etc: '광고게임 미술게임 기독교게임 교육용게임 엑서게임 리듬게임 파티게임 프로그래밍게임 퍼즐게임 기능성게임 스포츠게임 고전게임 오디오게임 캐주얼게임 미니게임 온라인게임 웹게임 대규모다중사용자온라인게임 전통게임 비디오게임 아티스트게임 샌드박스게임 쓰레기게임',
};

export default gameDict;
