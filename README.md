# Ficha do Tripa Seca — Rainha Rubra

Ficha de personagem editável para a campanha **Rainha Rubra**, feita para usar no celular.

- Toque em qualquer campo para editar. Tudo é salvo automaticamente no aparelho (localStorage).
- **Foto** do personagem: toque nela para trocar (a imagem é reduzida e salva junto com a ficha).
- **Povo**: sugere os povos do livro e mostra o bônus (atributo e estilo); "Aplicar bônus" soma os +1.
- **Rolagens** (regras do livro): botão d20 ao lado de cada atributo (d20 + atributo, com a dificuldade alcançada e críticos); painel *Ataque e dano* (d20 + atributo contra a Defesa do inimigo, e d6 de dano, com +1d6 extra e bônus fixo opcionais).
- **Regras rápidas do livro** no fim da página.
- Depois de aberta uma vez com internet, a ficha abre também sem sinal (modo offline).
- **Desfazer última troca** volta a ficha anterior depois de importar, restaurar ou limpar.
- **Exportar cópia** baixa um `.json`; **Importar cópia** restaura em outro aparelho.
- **Restaurar Tripa Seca** volta à ficha original; **Ficha em branco** limpa tudo para outro personagem.

Site estático (HTML + CSS + JS, sem build). Os dados originais do Tripa Seca ficam em `TRIPA_SECA` no `app.js`.
