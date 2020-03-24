
const sources = {
  titleWithdrawal: [
    '이용정보 동의하기',
    '출금금액 선택',
    '출금금액 확인',
    '완료'
  ],
  contentWithdrawal: {
    agreement:
    `보유한 수익금에 대해 출금 신청을 하실 수 있습니다. 출금 신청은 계약 시 동의하신 OnAD 서비스 이용 약관을 따릅니다.

    1. 회원이 자신의 아이디를 통해 수익금에 대한 출금을 신청하면 적법한 절차에 따라 출금 받을 수 있습니다. 단, 회원이 무료로 지급받은 수익금에 대해서는 출금할 수 없습니다.

    2. 출금 시에는 수익금에서 3.3%의 소득세를 공제한 금액을 입금해 드리며 수익금이 30,000원 미만인 경우에는 출금이 불가능합니다.

    3. 주민등록법, 저작권법, 컴퓨터프로그램보호법, 정보통신망법 등 각종 법령에 대한 중대한 불법행위 또는 크리에이터 이용약관 제 12조 상의 내용과 같이 서비스 운영에 심각한 악영향을 미치는 행위를 한 것으로 판단되는 이용자의 계정 및 아이디 이용을 제한하거나 해당 이용자와의 계약을 해지하는 경우, 회사는 수익금을 입금하지 않을 수 있습니다. 다만, 이용자가 중대한 불법행위 또는 서비스 운영에 심각한 악영향을 미치는 행위를 하지 않았다는 것을 소명하는 경우에는 그러하지 않습니다.

    4. 회사가 요청시 회원은 원활한 출금을 위하여 회원 명의의 신분증(또는 사업자등록증), 통장사본을 회사에 송부해야 하며, 그 경우 송부한 신분증(또는 사업자등록증)에 표기된 명의의 통장으로만 환전할 수 있습니다.

    5. 회원의 귀책으로 잘못된 은행정보로 인하여 정산 금액을 받지 못하는 경우 귀책사유는 회원 본인에게 있으며 회사는 이를 보상하거나 책임지지 않는다.
    `,
    itemTitle: '출금신청 이용 동의',
    agreementSub: `
    이용약관 및 출금과 관련된 아래의 '출금신청 이용정보 동의' 사항을 확인하고 동의하실 경우 출금 요청 절차가 진행됩니다.
    `,
    warning: `
      출금 신청은 30,000원 이상의 금액에 대해서만 신청 가능하며 수익금의 유효기간은 마지막 사용일로부터 5년까지입니다. 
      출금 신청 관련 문의는 OnAD 고객센터를 이용해 주세요.
    `,
    confirmWarning: `
    계좌번호와 예금주가 일치하지 않을 경우 출금 신청이 거절될 수 있으니 정확히 입력해주세요. 또한, 크리에이터님의 계좌에 실제로 입금될 금액은 소득세를 제한 금액이 입금됩니다. 출금 완료까지 하루 또는 이틀이 소요되어요!!
    `
  },
};

export default sources;