namespace APIProva12.Models;

public class Aluno{

    public int Id {get;set;}
    public string? Nome {get;set;}
    public string? Sobrenome {get;set;}
    public float Altura {get;set;}
    public float Peso {get;set;}

    public float IMC {get;set;} = 0;
    public string? Classificacao {get;set;}
    public int Obesidade {get;set;}
    public DateTime CriadoEm {get;set;}
}