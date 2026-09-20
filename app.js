(() => {
  'use strict';

  const STORAGE_KEY = 'rainha-rubra:ficha:v1';
  const BACKUP_KEY = 'rainha-rubra:ficha:anterior';
  const EXPORT_TAG = 'rainha-rubra-ficha';

  // ---------- estrutura da ficha ----------

  const ESTILOS = [
    'Arma Pesada', 'Arma Leve', 'Espada Longa', 'Espada Curta', 'Lança', 'Escudo',
    'Luta Corporal', 'Ambidestria', 'Arqueria', 'Invocação', 'Druidismo', 'Necromancia',
    'Ilusão', 'Curativa', 'Alquimia', 'Artilharia Leve', 'Artilharia Pesada',
    'Armadura Pesada', 'Armadura Média', 'Armadura Leve', 'Diplomacia', 'Aprendizado',
    'Sobrevivência',
  ];
  const PROTECAO = ['Cabeça', 'Torso', 'Braço direito', 'Braço esquerdo', 'Pernas', 'Pés'];
  const CONDICOES = [
    ['corrupcao', 'Corrupção', 'number'],
    ['descanso', 'Descanso'],
    ['saciedade', 'Saciedade'],
    ['ferimentos', 'Ferimentos'],
    ['doencas', 'Doenças'],
    ['maldicoes', 'Maldições'],
    ['efeitosMagicos', 'Efeitos mágicos'],
    ['reputacao', 'Reputação'],
  ];
  // bônus de povo, conforme "Passageiros que Podem Embarcar" no livro
  const POVOS = [
    { id: 'humano', nome: 'Humano', stems: ['humano'], attr: 'sorte', attrNome: 'Sorte', estilo: 'Diplomacia' },
    { id: 'elfo', nome: 'Elfo', stems: ['elfo'], attr: 'agilidade', attrNome: 'Agilidade', estilo: 'Arqueria' },
    { id: 'anao', nome: 'Anão', stems: ['anao', 'anoes', 'ano'], attr: 'forca', attrNome: 'Força', estilo: 'Artilharia Pesada' },
    { id: 'ogro', nome: 'Ogro', stems: ['ogro'], attr: 'forca', attrNome: 'Força', estilo: 'Arma Pesada' },
    { id: 'greyblood', nome: 'Greyblood', stems: ['greyblood'], attr: 'mente', attrNome: 'Mente', estilo: 'Ilusão' },
    { id: 'goblin', nome: 'Goblin', stems: ['goblin'], attr: 'agilidade', attrNome: 'Agilidade', estilo: 'Arma Leve' },
    { id: 'licano', nome: 'Licano', stems: ['licano'], attr: 'forca', attrNome: 'Força', estilo: 'Luta Corporal' },
    { id: 'akhat', nome: 'Akhat', stems: ['akhat'], attr: 'agilidade', attrNome: 'Agilidade', estilo: 'Sobrevivência' },
    { id: 'fauno', nome: 'Fauno', stems: ['fauno'], attr: 'mente', attrNome: 'Mente', estilo: 'Druidismo' },
  ];
  const FOTO_PADRAO = 'assets/tripa-seca.jpg';
  const ATRIBUTOS = [['forca', 'Força'], ['agilidade', 'Agilidade'], ['mente', 'Mente'], ['sorte', 'Sorte']];
  // níveis de dificuldade do livro, do mais alto para o mais baixo
  const DIFICULDADES = [[25, 'quase impossível'], [20, 'muito difícil'], [16, 'difícil'], [13, 'normal'], [10, 'fácil']];
  const N_HABILIDADES = 7;
  const N_EFEITOS = 3;
  const N_INVENTARIO = 8;
  const N_CAIXAS = 5;

  // história completa (aparece no "Saiba mais")
  const HISTORIA_COMPLETA = [
    'O Tripa Seca é como é conhecido um dos maiores ladinos da guilda dos Dedos Cinzas, uma guilda de ladrões lendários. Muitos deles conseguem ir e ver situações únicas e partem em busca dos tesouros de Eldharain, porém não voltam.',
    'Tripa Seca não era um tolo: não jogava para perder e não se arriscaria. Porém um trabalho inteligente poderia ser possível. Um dia antes, deveria ir até o cais e então se infiltrar no cargueiro da Rainha Rubra, onde grandes prêmios o aguardariam.',
    'Porém um dos amigos da toca o chamou para uma noite de farra algumas horas antes. Em seu relógio tudo estava no tempo, e alguns drinks não atrapalhariam seu processo. Ele o fez, e após 19 garrafas estava dentro do prazo, em um dos barris sendo transportado para a Rainha Rubra. Um golpe de mestre! Porém sua cabeça e seus olhos pesavam. Daria tempo de um breve descanso, e então, após sair do barril, encher os bolsos com as joias dos sonhadores viajantes da nova vida no continente, beber mais e viver como um rei por algumas semanas. Era com isso que sonhava, antes de acordar em alto-mar dentro da Rainha Rubra, rumo à nova vida no continente!!',
  ].join('\n\n');

  // valores da primeira versão da ficha, para atualizar sem apagar o que a pessoa editou
  const ANTIGO = {
    nome: 'Tripa Seca',
    aparencia: "Baixinho, cabeçudo e careca. Orelhas gigantes com argolas, a esquerda cortada em \"V\". Cicatriz na bochecha, manto remendado cheio de bolsos. Anda descalço.",
    historia: "Ex-ladrão da Guilda dos Dedos Cinzentos, expulso com a marca de traidor ao tentar pegar sua parte. Sem gostar de trabalhar com ninguém, virou mendigo de pão duro, até saber do tesouro da guilda a bordo da Rainha Rubra.",
  };

  // ---------- ficha original ----------

  const TRIPA_SECA = {
    foto: FOTO_PADRAO,
    bonusPovo: 'goblin',
    'atq.attr': 'agilidade',
    nome: 'Fineias o Tripa Seca',
    jogador: 'Keizo',
    povo: 'Goblin',
    idade: '38 anos',
    aparencia: 'Goblin baixo com sorriso malicioso, roupas de couro e capuzes com ferramentas de ladrão e careca brilhante.',
    historia: 'Um dos maiores ladinos da guilda dos Dedos Cinzas. Foi se infiltrar em um barril no cargueiro da Rainha Rubra para roubar as joias dos viajantes, mas, depois de 19 garrafas, dormiu no barril e acordou em alto-mar, rumo ao continente.',
    historiaCompleta: HISTORIA_COMPLETA,
    forca: '0', agilidade: '3', mente: '1', sorte: '2',
    vida: '8', defesa: '12', mana: '2',
    'est.1': '+1', 'est.3': 'X', 'est.15': 'X', 'est.19': 'X', 'est.20': 'X', 'est.21': 'X',
    'hab.0.on': '1', 'hab.0.nome': 'Coitadinho Profissional', 'hab.0.desc': 'finge ser inofensivo e é ignorado pelos inimigos.',
    'hab.1.on': '1', 'hab.1.nome': 'Mãozinha de Seda', 'hab.1.desc': 'furta um item pequeno como Ação Rápida.',
    'hab.2.on': '1', 'hab.2.nome': 'Truques da Guilda', 'hab.2.desc': 'reconhece sinais e golpes dos Dedos Cinzentos.',
    'hab.3.nome': 'Troca-Troca', 'hab.3.desc': 'troca um objeto por cópia falsa sem ser notado.',
    'hab.4.nome': 'Olho de Cofre', 'hab.4.desc': 'bônus em fechaduras, armadilhas e esconderijos.',
    'hab.5.nome': 'Sorriso 100% Confiável', 'hab.5.desc': '1x por sessão, convence que não foi ele.',
    'hab.6.nome': 'Golpe Traiçoeiro', 'hab.6.desc': '+1d6 de dano em alvo desprevenido.',
    armaPrincipal: 'Adaga curva',
    armaSecundaria: '3 facas de arremesso',
    itens: 'Gazuas, corda fina com gancho\nPó de fuligem, bolsa com fundo falso',
    moedas: '4 moedas de cobre',
    'prot.0': 'Nada (a careca é o capacete)', 'prot.1': 'Couro escuro leve',
    'prot.2': 'Faixas de pano', 'prot.3': 'Faixas de pano',
    'prot.4': 'Calça rasgada', 'prot.5': 'Descalço',
    'efeito.0': 'Não faz barulho ao andar.',
    'efeito.1': 'Bolsos ocultos escapam de revistas simples.',
    'inv.0': 'Colar roubado', 'inv.1': 'Duas colheres de prata', 'inv.2': 'Moeda de ouro com coroa',
    'inv.3': 'Pão duro', 'inv.4': 'Chave falsa do cofre de Vorlak', 'inv.5': 'Segredos da guilda em código',
    'inv.6': 'Meia de dono desconhecido', 'inv.7': 'Anel de lata (jura que é ouro)',
    'cond.corrupcao': '0', 'cond.descanso': 'Normal', 'cond.saciedade': 'Com fome (sempre)',
    'cond.ferimentos': 'Nenhum', 'cond.doencas': 'Nenhuma',
    'cond.maldicoes': 'Marca de traidor (orelha em V)', 'cond.efeitosMagicos': 'Nenhum',
    'cond.reputacao': 'Traidor dos Dedos Cinzentos',
  };

  // ---------- montagem do HTML ----------

  const range = (n) => Array.from({ length: n }, (_, i) => i);

  const linha = (key, label, { type = 'text', cls = '' } = {}) => `
    <label class="row ${cls}">
      <span class="lbl">${label}</span>
      <input data-k="${key}" type="${type}" autocomplete="off" enterkeyhint="next">
    </label>`;

  const numerado = (key, n) => `
    <label class="row numbered">
      <span class="lbl">${n}.</span>
      <textarea data-k="${key}" rows="1" autocomplete="off"></textarea>
    </label>`;

  const caixa = (key, rotulo) =>
    `<input class="box" type="checkbox" data-k="${key}" aria-label="${rotulo}">`;

  const secao = (cls, num, titulo, corpo) => `
    <section class="card ${cls}">
      <h2>${num}) ${titulo}</h2>
      ${corpo}
    </section>`;

  const status = (key, label) => `
    <div class="stat">
      <label class="row">
        <span class="lbl">${label}</span>
        <input class="num" data-k="${key}" type="number" autocomplete="off">
      </label>
      <span class="boxes">${range(N_CAIXAS).map((i) => caixa(`${key}.b${i}`, `${label} ${i + 1}`)).join('')}</span>
    </div>`;

  function montar() {
    const identificacao = secao('c-id', 1, 'Identificação', `
      <div class="id-top">
        <div class="id-fields">
          ${linha('nome', 'Nome')}
          ${linha('jogador', 'Jogador')}
          <label class="row"><span class="lbl">Povo</span><input data-k="povo" type="text" list="lista-povos" autocomplete="off"></label>
          ${linha('idade', 'Idade')}
          <p class="povo-hint" id="povo-hint" hidden>
            <span id="povo-txt"></span>
            <button type="button" class="btn mini" id="povo-aplicar">Aplicar bônus</button>
          </p>
          <datalist id="lista-povos">${POVOS.map((p) => `<option value="${p.nome}">`).join('')}</datalist>
        </div>
        <div class="foto-wrap">
          <button type="button" class="foto" id="foto-btn" aria-label="Trocar foto do personagem">
            <img id="foto-img" alt="Foto do personagem" hidden>
            <span class="foto-vazio" id="foto-vazio">+ foto</span>
          </button>
          <button type="button" class="link" id="foto-remover" hidden>remover foto</button>
          <input type="file" id="foto-arquivo" accept="image/*" hidden>
        </div>
      </div>
      <label class="row block"><span class="lbl">Aparência</span><textarea data-k="aparencia" rows="2"></textarea></label>
      <label class="row block"><span class="lbl">História</span><textarea data-k="historia" rows="3"></textarea></label>
      <div class="saiba-linha"><button type="button" class="btn mini" id="btn-saiba">Saiba mais</button></div>`);

    const atributos = secao('c-atr', 2, 'Atributos', `
      ${ATRIBUTOS.map(([k, nome]) => `
      <div class="row attr">
        <span class="lbl">${nome}</span>
        <button type="button" class="dado" data-rolar="${k}" aria-label="Rolar d20 + ${nome}">d20</button>
        <input data-k="${k}" type="number" autocomplete="off" aria-label="${nome}">
      </div>`).join('')}`);

    const statusSec = secao('c-sta', 3, 'Status', `
      ${status('vida', 'Vida')}
      ${status('defesa', 'Defesa')}
      ${status('mana', 'Mana')}
      <div class="ataque">
        <h3>Ataque e dano</h3>
        <div class="atq-linha">
          <label class="atq-campo">Atacar com
            <select data-k="atq.attr">
              ${ATRIBUTOS.map(([k, nome]) => `<option value="${k}">${nome}</option>`).join('')}
            </select>
          </label>
          <label class="atq-campo">Defesa do inimigo
            <input data-k="atq.defesa" type="number" placeholder="opcional" autocomplete="off">
          </label>
        </div>
        <div class="atq-linha">
          <label class="atq-campo">Bônus de dano
            <input data-k="atq.bonus" type="number" placeholder="0" autocomplete="off">
          </label>
          <label class="atq-check">
            ${caixa('atq.extra', 'Dano extra +1d6')}
            <span>+1d6 extra (ex.: Golpe Traiçoeiro)</span>
          </label>
        </div>
        <div class="atq-botoes">
          <button type="button" class="btn primary mini" id="btn-atacar">Atacar</button>
          <button type="button" class="btn mini" data-acao="dano">Só dano</button>
          <button type="button" class="btn mini" data-acao="d20">d20 puro</button>
        </div>
      </div>`);

    const estilos = secao('c-est', 4, 'Estilos de Jogo', `
      <div class="estilos">
        ${ESTILOS.map((nome, i) => `
          <label class="row est">
            <span class="lbl">${nome}</span>
            <input class="mark" data-k="est.${i}" type="text" maxlength="4" autocomplete="off" aria-label="${nome}">
          </label>`).join('')}
      </div>`);

    const habilidades = secao('c-hab', 5, 'Habilidades', range(N_HABILIDADES).map((i) => `
      <div class="hab">
        <span class="hab-n">${i + 1}.</span>
        ${caixa(`hab.${i}.on`, `Habilidade ${i + 1} ativa`)}
        <div class="hab-body">
          <label class="row"><span class="lbl">Nome</span><input data-k="hab.${i}.nome" type="text" autocomplete="off"></label>
          <label class="row"><span class="lbl small">Descrição</span><textarea data-k="hab.${i}.desc" rows="1"></textarea></label>
        </div>
      </div>`).join(''));

    const equipamento = secao('c-equ', 6, 'Equipamento', `
      ${linha('armaPrincipal', 'Arma principal')}
      ${linha('armaSecundaria', 'Arma secundária')}
      <label class="row block"><span class="lbl">Itens úteis</span><textarea data-k="itens" rows="3"></textarea></label>
      ${linha('moedas', 'Moedas')}`);

    const protecao = secao('c-pro', 7, 'Proteção', `
      ${PROTECAO.map((nome, i) => linha(`prot.${i}`, nome)).join('')}
      <h3>Efeitos da armadura / proteção</h3>
      ${range(N_EFEITOS).map((i) => numerado(`efeito.${i}`, i + 1)).join('')}`);

    const inventario = secao('c-inv', 8, 'Inventário',
      range(N_INVENTARIO).map((i) => numerado(`inv.${i}`, i + 1)).join(''));

    const condicoes = secao('c-con', 9, 'Condições',
      CONDICOES.map(([k, nome, type]) => linha(`cond.${k}`, nome, { type })).join(''));

    return [identificacao, atributos, statusSec, estilos, habilidades, equipamento, protecao, inventario, condicoes].join('');
  }

  // ---------- estado e persistência ----------

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  $('#ficha').innerHTML = montar();

  let state = {};
  let saveTimer = null;
  const statusEl = $('#status');

  function setStatus(msg, erro = false) {
    statusEl.textContent = msg;
    statusEl.classList.toggle('erro', erro);
  }

  function carregar() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) return sanitizar(JSON.parse(raw));
    } catch (_) { /* segue com a ficha padrão */ }
    return { ...TRIPA_SECA };
  }

  function sanitizar(obj) {
    const limpo = {};
    if (obj && typeof obj === 'object') {
      for (const [k, v] of Object.entries(obj)) {
        if (!['string', 'number', 'boolean'].includes(typeof v)) continue;
        const txt = String(v);
        // a foto só pode ser a padrão, vazia ou uma imagem embutida (nunca uma URL externa)
        if (k === 'foto' && txt && txt !== FOTO_PADRAO && !txt.startsWith('data:image/')) continue;
        limpo[k] = txt;
      }
    }
    return limpo;
  }

  // ficha salva na versão anterior: traz os dados novos sem apagar o que foi editado
  function migrar(st) {
    if ('historiaCompleta' in st || st.nome === undefined) return st;
    const novo = { ...st };
    for (const k of ['nome', 'aparencia', 'historia']) {
      if (novo[k] === ANTIGO[k]) novo[k] = TRIPA_SECA[k];
    }
    if (novo.jogador === undefined) novo.jogador = TRIPA_SECA.jogador;
    if (novo.historia === TRIPA_SECA.historia) novo.historiaCompleta = TRIPA_SECA.historiaCompleta;
    return novo;
  }

  function salvarAgora() {
    clearTimeout(saveTimer);
    saveTimer = null;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
      const h = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
      setStatus(`✓ Salvo neste aparelho às ${h}`);
    } catch (_) {
      setStatus('Não deu para salvar neste navegador — use Exportar cópia', true);
    }
  }

  function agendarSalvar() {
    setStatus('Salvando…');
    clearTimeout(saveTimer);
    saveTimer = setTimeout(salvarAgora, 400);
  }

  function aplicar() {
    $$('[data-k]').forEach((el) => {
      const v = state[el.dataset.k] || '';
      if (el.type === 'checkbox') el.checked = v === '1';
      else el.value = v || (el.tagName === 'SELECT' ? el.options[0].value : '');
    });
    ajustarAlturas();
    atualizarTitulo();
    renderFoto();
    renderPovo();
  }

  function atualizarTitulo() {
    const nome = (state.nome || '').trim();
    document.title = nome ? `Ficha de ${nome} — Rainha Rubra` : 'Ficha — Rainha Rubra';
  }

  function ajustarAlturas() {
    $$('#ficha textarea').forEach((ta) => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    });
  }

  // ---------- foto ----------

  const fotoBtn = $('#foto-btn');
  const fotoImg = $('#foto-img');
  const fotoVazio = $('#foto-vazio');
  const fotoRemover = $('#foto-remover');

  function fotoAtual() {
    // ficha antiga sem o campo "foto" mostra a foto padrão do Tripa Seca
    return 'foto' in state ? state.foto : FOTO_PADRAO;
  }

  function renderFoto() {
    const src = fotoAtual();
    fotoImg.hidden = !src;
    fotoVazio.hidden = !!src;
    fotoRemover.hidden = !src;
    if (src) {
      if (fotoImg.getAttribute('src') !== src) fotoImg.setAttribute('src', src);
      fotoImg.classList.toggle('padrao', src === FOTO_PADRAO);
    } else {
      fotoImg.removeAttribute('src');
    }
  }

  function reduzirImagem(arquivo, max = 480) {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(arquivo);
      const img = new Image();
      img.onload = () => {
        const k = Math.min(1, max / Math.max(img.width, img.height));
        const c = document.createElement('canvas');
        c.width = Math.round(img.width * k);
        c.height = Math.round(img.height * k);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        resolve(c.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('imagem')); };
      img.src = url;
    });
  }

  // ---------- povo e bônus ----------

  const normalizar = (t) => (t || '').trim().toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');

  function povoAtual() {
    const n = normalizar(state.povo);
    if (!n) return null;
    return POVOS.find((p) => p.stems.some((st) => n === st || n === `${st}s`)) || null;
  }

  function renderPovo() {
    const p = povoAtual();
    const hint = $('#povo-hint');
    hint.hidden = !p;
    if (!p) return;
    $('#povo-txt').textContent = `Bônus de ${p.nome}: +1 ${p.attrNome}, estilo +1 ${p.estilo}.`;
    const btn = $('#povo-aplicar');
    const feito = state.bonusPovo === p.id;
    btn.disabled = feito;
    btn.textContent = feito ? 'Bônus já aplicado' : 'Aplicar bônus';
  }

  function aplicarBonusPovo() {
    const p = povoAtual();
    if (!p || state.bonusPovo === p.id) return;
    if (!confirm(`Somar +1 em ${p.attrNome} e +1 em ${p.estilo}? Faça isso só uma vez por ficha.`)) return;
    state[p.attr] = String((parseInt(state[p.attr], 10) || 0) + 1);
    const i = ESTILOS.indexOf(p.estilo);
    const atual = (state[`est.${i}`] || '').trim();
    const num = atual.match(/^\+?(\d+)$/);
    state[`est.${i}`] = num ? `+${parseInt(num[1], 10) + 1}` : (atual ? `${atual} +1` : '+1');
    state.bonusPovo = p.id;
    aplicar();
    salvarAgora();
  }

  // ---------- rolagens ----------

  const rolagemEl = $('#rolagem');
  const dado = (lados) => {
    const buf = new Uint32Array(1);
    crypto.getRandomValues(buf);
    return (buf[0] % lados) + 1;
  };
  const inteiro = (v) => parseInt(v, 10) || 0;
  const comSinal = (n) => (n < 0 ? `− ${Math.abs(n)}` : `+ ${n}`);

  function mostrarRolagem(titulo, principal, detalhes = []) {
    rolagemEl.replaceChildren();
    const mk = (tag, cls, txt) => {
      const e = document.createElement(tag);
      if (cls) e.className = cls;
      e.textContent = txt;
      return e;
    };
    rolagemEl.append(mk('div', 'rol-titulo', titulo), mk('div', 'rol-total', principal));
    detalhes.forEach(([cls, txt]) => rolagemEl.append(mk('div', cls, txt)));
    rolagemEl.append(mk('div', 'rol-fechar', 'toque para fechar'));
    rolagemEl.hidden = false;
  }

  const notaCritica = (r) => {
    if (r === 20) return [['rol-crit', '20 natural: sucesso crítico!']];
    if (r === 1) return [['rol-falha', '1 natural: falha crítica!']];
    return [];
  };

  // dano = d6 (+ 1d6 extra, se marcado) + bônus fixo
  function calcularDano() {
    const partes = [dado(6)];
    if (state['atq.extra'] === '1') partes.push(dado(6));
    const bonus = inteiro(state['atq.bonus']);
    const total = partes.reduce((a, b) => a + b, 0) + bonus;
    const txt = partes.map((d, i) => (i ? `+ d6 extra (${d})` : `d6 (${d})`)).join(' ')
      + (bonus ? ` ${comSinal(bonus)}` : '');
    return { total, txt };
  }

  function rolarAtributo(chave) {
    const nome = ATRIBUTOS.find(([k]) => k === chave)[1];
    const bonus = inteiro(state[chave]);
    const r = dado(20);
    const total = r + bonus;
    const alcancada = DIFICULDADES.find(([min]) => total >= min);
    const det = [
      ...notaCritica(r),
      ['rol-info', alcancada
        ? `Vence dificuldade até ${alcancada[1]} (${alcancada[0]}).`
        : 'Abaixo de fácil (10).'],
    ];
    mostrarRolagem(`${nome}: d20 (${r}) ${comSinal(bonus)}`, `= ${total}`, det);
  }

  function atacar() {
    const chave = state['atq.attr'] || ATRIBUTOS[0][0];
    const nome = ATRIBUTOS.find(([k]) => k === chave)[1];
    const bonus = inteiro(state[chave]);
    const r = dado(20);
    const total = r + bonus;
    const titulo = `Ataque com ${nome}: d20 (${r}) ${comSinal(bonus)}`;
    const temDefesa = String(state['atq.defesa'] || '').trim() !== '';
    const defesa = inteiro(state['atq.defesa']);
    const det = notaCritica(r);
    let acertou;
    if (r === 20) acertou = true;
    else if (r === 1) acertou = false;
    else if (temDefesa) acertou = total >= defesa;
    if (!temDefesa && r !== 20 && r !== 1) {
      det.push(['rol-info', 'Compare com a Defesa do inimigo. Se acertar, role o dano em "Só dano".']);
      mostrarRolagem(titulo, `= ${total}`, det);
      return;
    }
    if (acertou) {
      const d = calcularDano();
      det.push(['rol-acerto', temDefesa ? `Acertou! (${total} contra Defesa ${defesa})` : 'Acertou!']);
      det.push(['rol-dano', `Dano: ${d.total}`]);
      det.push(['rol-info', d.txt]);
    } else {
      det.push(['rol-falha', temDefesa && r !== 1 ? `Errou. (${total} contra Defesa ${defesa})` : 'Errou.']);
    }
    mostrarRolagem(titulo, `= ${total}`, det);
  }

  function soDano() {
    const d = calcularDano();
    mostrarRolagem('Dano', String(d.total), [['rol-info', d.txt]]);
  }

  function d20Puro() {
    const r = dado(20);
    mostrarRolagem('d20 puro', String(r), notaCritica(r));
  }

  // ---------- história completa ----------

  const modal = $('#modal-hist');
  const histLeitura = $('#hist-leitura');
  const histEdicao = $('#hist-edicao');
  const histEditar = $('#hist-editar');

  function renderLeitura() {
    histLeitura.replaceChildren();
    const texto = (state.historiaCompleta || '').trim();
    if (!texto) {
      const p = document.createElement('p');
      p.className = 'vazio';
      p.textContent = 'Ainda não tem história completa. Toque em Editar para escrever.';
      histLeitura.append(p);
      return;
    }
    texto.split(/\n{2,}/).forEach((par) => {
      const p = document.createElement('p');
      p.textContent = par;
      histLeitura.append(p);
    });
  }

  function modoEdicao(ligado) {
    histEdicao.hidden = !ligado;
    histLeitura.hidden = ligado;
    histEditar.textContent = ligado ? 'Pronto' : 'Editar';
    if (ligado) histEdicao.focus();
    else renderLeitura();
  }

  function abrirHistoria() {
    $('#hist-titulo').textContent = state.nome ? `A história de ${state.nome.trim()}` : 'A história';
    modal.hidden = false;
    document.body.style.overflow = 'hidden';
    modoEdicao(!(state.historiaCompleta || '').trim());
    $('#modal-hist .modal-painel').scrollTop = 0;
  }

  function fecharHistoria() {
    modal.hidden = true;
    document.body.style.overflow = '';
    $('#btn-saiba').focus();
  }

  // ---------- ações ----------

  function exportar() {
    salvarAgora();
    const pacote = { app: EXPORT_TAG, versao: 1, exportadoEm: new Date().toISOString(), dados: state };
    const blob = new Blob([JSON.stringify(pacote, null, 2)], { type: 'application/json' });
    const nome = (state.nome || 'ficha').trim().toLowerCase().normalize('NFD')
      .replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'ficha';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `ficha-${nome}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }

  function importar(arquivo) {
    const leitor = new FileReader();
    leitor.onload = () => {
      try {
        const json = JSON.parse(leitor.result);
        const dados = json && json.app === EXPORT_TAG ? json.dados : json;
        const novo = sanitizar(dados);
        if (!Object.keys(novo).length) throw new Error('vazio');
        if (!('foto' in novo)) novo.foto = ''; // cópia sem foto não herda a do Tripa Seca
        if (!confirm('Importar esta cópia vai substituir a ficha atual. Continuar?')) return;
        guardarAnterior();
        state = novo;
        aplicar();
        salvarAgora();
      } catch (_) {
        alert('Não consegui ler esse arquivo. Ele precisa ser uma cópia exportada por esta ficha.');
      }
    };
    leitor.readAsText(arquivo);
  }

  // guarda a ficha atual antes de trocá-la, para dar para desfazer
  function guardarAnterior() {
    try {
      localStorage.setItem(BACKUP_KEY, JSON.stringify(state));
      $('#btn-undo').hidden = false;
    } catch (_) { /* sem espaço: segue sem backup */ }
  }

  function desfazerTroca() {
    let anterior;
    try { anterior = sanitizar(JSON.parse(localStorage.getItem(BACKUP_KEY))); } catch (_) { return; }
    if (!Object.keys(anterior).length) return;
    if (!confirm('Voltar para a ficha de antes da última troca? A ficha de agora fica guardada, então dá para desfazer de novo.')) return;
    guardarAnterior();
    state = anterior;
    aplicar();
    salvarAgora();
  }

  function substituir(novoEstado, pergunta) {
    if (!confirm(pergunta)) return;
    guardarAnterior();
    state = novoEstado;
    aplicar();
    salvarAgora();
  }

  // ---------- início ----------

  state = migrar(carregar());
  aplicar();
  setStatus('Pronta para editar');

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.dataset || !el.dataset.k) return;
    state[el.dataset.k] = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value;
    if (el.tagName === 'TEXTAREA' && el.closest('#ficha')) {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
    if (el.dataset.k === 'nome') atualizarTitulo();
    if (el.dataset.k === 'povo') renderPovo();
    agendarSalvar();
  });

  window.addEventListener('pagehide', () => { if (saveTimer) salvarAgora(); });
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden' && saveTimer) salvarAgora();
  });

  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(ajustarAlturas, 150);
  });
  // as fontes chegam depois do primeiro desenho e mudam a quebra de linha: mede de novo quando terminam
  if (document.fonts) {
    document.fonts.ready.then(ajustarAlturas);
    document.fonts.addEventListener('loadingdone', ajustarAlturas);
  }
  window.addEventListener('load', ajustarAlturas);

  fotoBtn.addEventListener('click', () => $('#foto-arquivo').click());
  $('#foto-arquivo').addEventListener('change', async (e) => {
    const f = e.target.files[0];
    e.target.value = '';
    if (!f) return;
    try {
      state.foto = await reduzirImagem(f);
      renderFoto();
      agendarSalvar();
    } catch (_) {
      alert('Não consegui abrir essa imagem.');
    }
  });
  fotoRemover.addEventListener('click', () => {
    state.foto = '';
    renderFoto();
    agendarSalvar();
  });
  $('#povo-aplicar').addEventListener('click', aplicarBonusPovo);

  document.addEventListener('click', (e) => {
    const b = e.target.closest('[data-rolar], [data-acao], #btn-atacar');
    if (!b) return;
    if (b.dataset.rolar) rolarAtributo(b.dataset.rolar);
    else if (b.id === 'btn-atacar') atacar();
    else if (b.dataset.acao === 'dano') soDano();
    else if (b.dataset.acao === 'd20') d20Puro();
  });
  rolagemEl.addEventListener('click', () => { rolagemEl.hidden = true; });

  $('#btn-saiba').addEventListener('click', abrirHistoria);
  $('#hist-fechar').addEventListener('click', fecharHistoria);
  histEditar.addEventListener('click', () => modoEdicao(histEdicao.hidden));
  modal.addEventListener('click', (e) => { if (e.target === modal) fecharHistoria(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !modal.hidden) fecharHistoria(); });

  $('#btn-undo').hidden = !localStorage.getItem(BACKUP_KEY);
  $('#btn-undo').addEventListener('click', desfazerTroca);
  $('#btn-export').addEventListener('click', exportar);
  $('#btn-import').addEventListener('click', () => $('#file-import').click());
  $('#file-import').addEventListener('change', (e) => {
    const f = e.target.files[0];
    if (f) importar(f);
    e.target.value = '';
  });
  $('#btn-print').addEventListener('click', () => window.print());
  $('#btn-default').addEventListener('click', () =>
    substituir({ ...TRIPA_SECA }, 'Voltar para a ficha original do Tripa Seca? O que está na ficha agora será perdido (exporte antes se quiser guardar).'));
  $('#btn-blank').addEventListener('click', () =>
    substituir({ foto: '' }, 'Limpar a ficha inteira? O que está na ficha agora será perdido (exporte antes se quiser guardar).'));

  if ('serviceWorker' in navigator && (location.protocol === 'https:' || location.hostname === 'localhost')) {
    navigator.serviceWorker.register('sw.js').catch(() => { /* funciona igual, só sem modo offline */ });
  }
})();
