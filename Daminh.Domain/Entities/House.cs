using System.Collections.Generic; // thu vien cho List
namespace Daminh.Domain.Entities
{
    public class House : BaseEntity
    {
        public int Id { get; set; } // Map voi Id_H
        public string Name { get; set; } = string.Empty; // name_H
        public double FundBalance { get; set; } = 0; // Se dung Transaction de thay doi
        public string State { get; set; } = string.Empty; // state_H
        public int NumberOfMembers { get; set; } // Number


        // Nagavition property
        public virtual ICollection<User> Users {get;set;} = new List<User>();
        public virtual ICollection<FinancialTransaction> Transactions {get;set;} = new List<FinancialTransaction>();
    }
}