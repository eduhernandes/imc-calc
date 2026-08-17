const API = '/api/registros';

// Mapeamento de classificação para classe CSS de badge
function badgeClass(classificacao) {
  const map = {
    'Abaixo do peso':   'badge-abaixo',
    'Peso normal':      'badge-normal',
    'Sobrepeso':        'badge-sobre',
    'Obesidade Grau I': 'badge-ob1',
    'Obesidade Grau II':'badge-ob2',
    'Obesidade Grau III':'badge-ob3',
  };
  return map[classificacao] || 'badge-normal';
}

// Formata data para exibição
function formatarData(iso) {
  return new Date(iso).toLocaleString('pt-BR', {
    day: '2-digit', month: '2-digit', year: 'numeric',
    hour: '2-digit', minute: '2-digit',
  });
}

// ── CARREGAR REGISTROS ────────────────────────────────────────────
async function carregarRegistros() {
  const loading  = document.getElementById('loadingTable');
  const empty    = document.getElementById('emptyState');
  const tabela   = document.getElementById('tabelaRegistros');
  const corpo    = document.getElementById('corpoTabela');

  loading.hidden = false;
  tabela.classList.add('hidden');
  empty.classList.add('hidden');

  try {
    const res  = await fetch(API);
    const data = await res.json();

    loading.hidden = true;

    if (!data.length) {
      empty.classList.remove('hidden');
      return;
    }

    corpo.innerHTML = '';
    data.forEach((r, index) => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td>${index + 1}</td>
        <td><strong>${r.nome}</strong></td>
        <td>${Number(r.peso).toFixed(1)}</td>
        <td>${Number(r.altura).toFixed(2)}</td>
        <td class="td-imc">${Number(r.imc).toFixed(2)}</td>
        <td><span class="resultado-badge ${badgeClass(r.classificacao)}">${r.classificacao}</span></td>
        <td>${formatarData(r.criado_em)}</td>
        <td><button class="btn-delete" data-id="${r.id}">Excluir</button></td>
      `;
      corpo.appendChild(tr);
    });

    tabela.classList.remove('hidden');

    // Delegação de eventos para botões de excluir
    corpo.querySelectorAll('.btn-delete').forEach(btn => {
      btn.addEventListener('click', () => excluirRegistro(btn.dataset.id));
    });

  } catch (err) {
    loading.hidden = true;
    empty.textContent = '⚠️ Erro ao carregar registros. Verifique o servidor.';
    empty.classList.remove('hidden');
  }
}

// ── EXCLUIR REGISTRO ─────────────────────────────────────────────
async function excluirRegistro(id) {
  if (!confirm('Deseja excluir este registro?')) return;
  try {
    await fetch(`${API}/${id}`, { method: 'DELETE' });
    carregarRegistros();
  } catch (err) {
    alert('Erro ao excluir registro.');
  }
}

// ── SUBMETER FORMULÁRIO ───────────────────────────────────────────
document.getElementById('formImc').addEventListener('submit', async (e) => {
  e.preventDefault();

  const nome   = document.getElementById('nome').value.trim();
  const peso   = parseFloat(document.getElementById('peso').value);
  const altura = parseFloat(document.getElementById('altura').value);

  const btnText    = document.querySelector('.btn-text');
  const btnLoading = document.querySelector('.btn-loading');
  const btnCalc    = document.getElementById('btnCalcular');

  // Feedback de carregamento
  btnCalc.disabled  = true;
  btnText.hidden    = true;
  btnLoading.hidden = false;

  try {
    const res  = await fetch(API, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome, peso, altura }),
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.erro || 'Erro ao calcular IMC.');
      return;
    }

    // Exibir resultado
    const resultado = document.getElementById('resultado');
    document.getElementById('valorImc').textContent       = Number(data.imc).toFixed(2);
    document.getElementById('nomeResultado').textContent  = data.nome;
    const badge = document.getElementById('badgeClassificacao');
    badge.textContent  = data.classificacao;
    badge.className    = `resultado-badge ${badgeClass(data.classificacao)}`;
    resultado.classList.remove('hidden');

    // Limpar formulário e atualizar tabela
    e.target.reset();
    carregarRegistros();

  } catch (err) {
    alert('Erro de conexão com o servidor.');
  } finally {
    btnCalc.disabled  = false;
    btnText.hidden    = false;
    btnLoading.hidden = true;
  }
});

// ── BOTÃO ATUALIZAR ───────────────────────────────────────────────
document.getElementById('btnAtualizar').addEventListener('click', carregarRegistros);

// ── CARREGA AO INICIAR ────────────────────────────────────────────
carregarRegistros();
