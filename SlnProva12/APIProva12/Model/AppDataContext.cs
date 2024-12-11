using APIProva12.Models;
using Microsoft.EntityFrameworkCore;	

public class AppDataContext : DbContext
{
    public DbSet<Aluno> Alunos { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        optionsBuilder.UseSqlite("Data Source=FelipeUemura.db");
    }
    
}
