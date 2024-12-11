using APIProva12.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddDbContext<AppDataContext>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin", policy =>
    {
        policy.WithOrigins("http://localhost:3000") // ROTA DO FRONT
              .AllowAnyMethod()
              .AllowAnyHeader();
    });
});

builder.Services.AddControllers();

var app = builder.Build();

app.UseCors("AllowSpecificOrigin");
app.UseAuthorization();
app.MapControllers();

app.MapPost("/api/aluno/cadastrar", ([FromBody] Aluno aluno, [FromServices] AppDataContext ctx) => {

    if(aluno.Nome == aluno.Sobrenome){
        return Results.BadRequest("O Aluno nao pode ter o nome e sobre nome iguais.");
    }

    ctx.Alunos.Add(aluno);
    ctx.SaveChanges();
    return Results.Created("", aluno);
});


app.MapPut("/api/imc/cadastrar/{Id}", ([FromRoute] int Id, [FromBody] Aluno alunoAtualizado, [FromServices] AppDataContext ctx) =>
{
    var alunoExistente = ctx.Alunos.Find(Id);

    if (alunoExistente == null)
    {
        return Results.NotFound($"Aluno com ID {Id} não encontrada.");
    }

    alunoExistente.Peso = alunoAtualizado.Peso;
    alunoExistente.Altura = alunoAtualizado.Altura;

    ctx.Alunos.Update(alunoExistente);

    alunoAtualizado.IMC = alunoExistente.Peso / (alunoAtualizado.Altura * alunoAtualizado.Altura);
    
    if(alunoAtualizado.IMC < 18.5){
        alunoAtualizado.Classificacao = "Magreza";
        alunoAtualizado.Obesidade = 0;
    }else if(alunoAtualizado.IMC >= 18.5 && alunoAtualizado.IMC <= 24.9){
        alunoAtualizado.Classificacao = "Normal";
        alunoAtualizado.Obesidade = 0;
    }else if(alunoAtualizado.IMC >= 25.0 && alunoAtualizado.IMC <= 29.9){
        alunoAtualizado.Classificacao = "SobrePeso";
        alunoAtualizado.Obesidade = 1;
    }else if(alunoAtualizado.IMC >= 30.0 && alunoAtualizado.IMC <= 39.9){
        alunoAtualizado.Classificacao = "Obesidade";
        alunoAtualizado.Obesidade = 2;
    }else if(alunoAtualizado.IMC > 40.0){   
        alunoAtualizado.Classificacao = "ObesidadeGrave";
        alunoAtualizado.Obesidade = 3;
    }

    alunoExistente.IMC = alunoAtualizado.IMC;
    alunoExistente.Classificacao = alunoAtualizado.Classificacao;
    alunoExistente.Obesidade = alunoAtualizado.Obesidade;

    ctx.SaveChanges();
    return Results.Ok(alunoExistente);
});

app.MapGet("/api/imc/listar", ([FromServices] AppDataContext ctx) => {
    
    return Results.Ok(ctx.Alunos.Where(x => x.IMC != 0).ToList());

});
app.MapGet("/api/imc/listarporaluno/{Id}", ([FromServices] AppDataContext ctx, [FromRoute] int Id) => {
    
    var alunoExistente = ctx.Alunos.Find(Id);

    if (alunoExistente == null)
    {
        return Results.NotFound($"Aluno com ID {Id} não encontrada.");
    }    

    return Results.Ok(alunoExistente);

});

app.MapPut("/api/imc/alterar/{Id}", ([FromRoute] int Id, [FromServices] AppDataContext ctx, [FromBody] Aluno alunoAtualizado ) => {

    var alunoExistente = ctx.Alunos.Find(Id);

    if (alunoExistente == null)
    {
        return Results.NotFound($"pessoa com ID {Id} não encontrada.");
    }

    alunoExistente.Nome = alunoAtualizado.Nome;
    alunoExistente.Sobrenome = alunoAtualizado.Sobrenome;
    alunoExistente.Peso = alunoAtualizado.Peso;
    alunoExistente.Altura = alunoAtualizado.Altura;
    alunoExistente.IMC = alunoAtualizado.IMC;
    alunoExistente.Classificacao = alunoAtualizado.Classificacao;
    alunoExistente.Obesidade = alunoAtualizado.Obesidade;
    alunoExistente.CriadoEm = alunoAtualizado.CriadoEm;

    ctx.SaveChanges();

    return Results.Ok(alunoExistente);    

});

app.Run();
