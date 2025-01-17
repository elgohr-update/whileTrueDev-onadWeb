import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { MarketerSalesIncomeSettlementLogs } from './MarketerSalesIncomeSettlementLogs';
import { MerchandiseOrders } from './MerchandiseOrders';

@Entity('merchandiseOrdersDetail', { schema: 'onadnode' })
export class MerchandiseOrdersDetail {
  @PrimaryGeneratedColumn({ type: 'int', name: 'id', unsigned: true })
  id: number;

  @Column('int', {
    name: 'orderId',
    nullable: true,
    comment: '연결된 주문 아이디',
    unsigned: true,
  })
  orderId: number | null;

  @OneToOne(
    () => MerchandiseOrders,
    merchandiseOrders => merchandiseOrders.merchandiseOrderDetails,
    { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'orderId', referencedColumnName: 'id' }])
  order: MerchandiseOrders;

  @Column('varchar', {
    comment: '결제방법',
    length: 50,
  })
  paymentMethod: string;

  @Column('varchar', {
    comment: '구매채널(일반채널-응원메세지 없는경우, 방송인채널-응원메세지 있는경우)',
    default: '일반채널',
    length: 50,
  })
  purchaseChannel: string;

  @Column('int', {
    comment: '일반수수료(크리에이터+온애드)',
    default: 0,
    unsigned: true,
  })
  commissionAmount: number;

  @Column('int', {
    comment: '전자결제수수료(다날/iamport/...)',
    default: 0,
    unsigned: true,
  })
  paymentCommissionAmount: number;

  @Column('int', {
    comment: '부가세(일반수수료합 * 10%)',
    default: 0,
    unsigned: true,
  })
  VAT: number;

  @Column('int', {
    comment: '실지급액',
    default: 0,
    unsigned: true,
  })
  actualSendedAmount: number;

  @Column('timestamp', {
    comment: '취소일자',
    nullable: true,
  })
  cancelDate?: Date;

  @Column('timestamp', {
    comment: '주문확정 일자',
    nullable: true,
  })
  purchaseConfirmDate?: Date;

  @Column('timestamp', {
    name: 'createDate',
    default: () => 'CURRENT_TIMESTAMP',
  })
  createDate: Date;

  @Column('timestamp', {
    name: 'updateDate',
    default: () => 'CURRENT_TIMESTAMP',
    onUpdate: 'CURRENT_TIMESTAMP',
  })
  updateDate: Date;

  @OneToOne(
    () => MarketerSalesIncomeSettlementLogs,
    salesIncomeSettlement => salesIncomeSettlement.orderDetail,
    { onDelete: 'RESTRICT', onUpdate: 'NO ACTION' },
  )
  @JoinColumn([{ name: 'settlementLogId', referencedColumnName: 'id' }])
  settlementLog: MarketerSalesIncomeSettlementLogs;
}
