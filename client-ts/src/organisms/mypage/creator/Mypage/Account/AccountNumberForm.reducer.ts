import banks from './banks';

export interface AccountNumberFormState {
  name: string;
  code: string;
}
export type AccountNumberFormAction = {type: 'set'; name: string }

const AccountNumberFormReducer = (
  state: AccountNumberFormState, action: AccountNumberFormAction
): AccountNumberFormState => {
  const bank = banks.find((_bank) => _bank.bankName === action.name);
  if (!bank) {
    throw Error('Invalid Bank Code');
  }
  switch (action.type) {
    case 'set':
      return {
        name: action.name,
        code: bank.bankCode
      };
    default:
      return { name: '농협', code: '011' };
  }
};

export default AccountNumberFormReducer;
