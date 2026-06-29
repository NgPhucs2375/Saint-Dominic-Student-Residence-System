using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Daminh.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameUpdateByToUpdatedBy : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Users",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "LeaveRequest",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Houses",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "FinancialTransactions",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Events",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "DutyRosters",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "DisciplinaryRecords",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Delegations",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Attendances",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "Announcements",
                newName: "UpdatedBy");

            migrationBuilder.RenameColumn(
                name: "UpdateBy",
                table: "AcademicTransactions",
                newName: "UpdatedBy");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Users",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "LeaveRequest",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Houses",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "FinancialTransactions",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Events",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "DutyRosters",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "DisciplinaryRecords",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Delegations",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Attendances",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "Announcements",
                newName: "UpdateBy");

            migrationBuilder.RenameColumn(
                name: "UpdatedBy",
                table: "AcademicTransactions",
                newName: "UpdateBy");
        }
    }
}
