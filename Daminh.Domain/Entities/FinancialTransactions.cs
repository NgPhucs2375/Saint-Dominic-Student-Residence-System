using Daminh.Domain.Enums;
using System; // thu vien cho DateTime

namespace Daminh.Domain.Entities
{
    public class FinancialTransaction : BaseEntity
    {
        public int Id {get;set;}
        public int HouseId {get;set;} // Id cua house ma giao dich thuoc ve
        public int CreatorId {get;set;} // QL tao
        public TransactionType Type {get;set;} // loai giao dich, su dung enum TransactionsType de gioi han gia tri nhap vao
        public double Amount {get;set;} // so tien giao dich, se duoc cong vao FundBalance neu Type = Deposit, tru vao FundBalance neu Type = Withdrawal
        public TransactionStatus Status {get;set;} // trang thai giao dich, su dung enum TransactionStatus de gioi han gia tri nhap vao, default la Pending

        public string Description {get;set;} = string.Empty; // mo ta giao dich
        public DateTime TransactionDate {get;set;} = DateTime.UtcNow; // thoi gian giao dich, default la thoi gian hien tai
        public string? ReceiptUrl {get;set;} // url cua hoa don, chi ap dung cho giao dich loai Withdrawal

        //Navigation property
        public virtual House House {get;set;} = null!; // mot giao dich thuoc mot house
        public virtual User Creator {get;set;} = null!; // mot giao dich duoc thuc hien boi mot user
    }
}