(() => {
  'use strict';

  const STORAGE_KEY = 'rainha-rubra:ficha:v1';
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
  const N_HABILIDADES = 7;
  const N_EFEITOS = 3;
  const N_INVENTARIO = 8;
  const N_CAIXAS = 5;

  // ---------- Tripa Seca (ficha original) ----------

  const TRIPA_SECA = {
    nome: 'Tripa Seca',
    povo: 'Goblin',
    idade: '38 anos',
    aparencia: 'Baixinho, cabeçudo e careca. Orelhas gigantes com argolas, a esquerda cortada em "V". Cicatriz na bochecha, manto remendado cheio de bolsos. Anda descalço.',
    historia: 'Ex-ladrão da Guilda dos Dedos Cinzentos, expulso com a marca de traidor ao tentar pegar sua parte. Sem gostar de trabalhar com ninguém, virou mendigo de pão duro, até saber do tesouro da guilda a bordo da Rainha Rubra.',
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
      ${linha('nome', 'Nome')}
      ${linha('povo', 'Povo')}
      ${linha('idade', 'Idade')}
      <label class="row block"><span class="lbl">Aparência</span><textarea data-k="aparencia" rows="2"></textarea></label>
      <label class="row block"><span class="lbl">História</span><textarea data-k="historia" rows="3"></textarea></label>`);

    const atributos = secao('c-atr', 2, 'Atributos', `
      ${linha('forca', 'Força', { type: 'number', cls: 'attr' })}
      ${linha('agilidade', 'Agilidade', { type: 'number', cls: 'attr' })}
      ${linha('mente', 'Mente', { type: 'number', cls: 'attr' })}
      ${linha('sorte', 'Sorte', { type: 'number', cls: 'attr' })}`);

    const statusSec = secao('c-sta', 3, 'Status', `
      ${status('vida', 'Vida')}
      ${status('defesa', 'Defesa')}
      ${status('mana', 'Mana')}`);

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
        if (['string', 'number', 'boolean'].includes(typeof v)) limpo[k] = String(v);
      }
    }
    return limpo;
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
      else el.value = v;
    });
    ajustarAlturas();
    atualizarTitulo();
  }

  function atualizarTitulo() {
    const nome = (state.nome || '').trim();
    document.title = nome ? `Ficha de ${nome} — Rainha Rubra` : 'Ficha — Rainha Rubra';
  }

  function ajustarAlturas() {
    $$('textarea').forEach((ta) => {
      ta.style.height = 'auto';
      ta.style.height = `${ta.scrollHeight}px`;
    });
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
        if (!confirm('Importar esta cópia vai substituir a ficha atual. Continuar?')) return;
        state = novo;
        aplicar();
        salvarAgora();
      } catch (_) {
        alert('Não consegui ler esse arquivo. Ele precisa ser uma cópia exportada por esta ficha.');
      }
    };
    leitor.readAsText(arquivo);
  }

  function substituir(novoEstado, pergunta) {
    if (!confirm(pergunta)) return;
    state = novoEstado;
    aplicar();
    salvarAgora();
  }

  // ---------- início ----------

  $('#ficha').innerHTML = montar();
  state = carregar();
  aplicar();
  setStatus('Pronta para editar');

  document.addEventListener('input', (e) => {
    const el = e.target;
    if (!el.dataset || !el.dataset.k) return;
    state[el.dataset.k] = el.type === 'checkbox' ? (el.checked ? '1' : '') : el.value;
    if (el.tagName === 'TEXTAREA') {
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }
    if (el.dataset.k === 'nome') atualizarTitulo();
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
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(ajustarAlturas);

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
    substituir({}, 'Limpar a ficha inteira? O que está na ficha agora será perdido (exporte antes se quiser guardar).'));
})();
