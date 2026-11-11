const contract = document.querySelector('#contract');
const serviceTypes = ['Fiber optic', 'DSL', 'No'];
const rows = [...document.querySelectorAll('.bar-row')];
const sample = document.querySelector('#sample');

async function initializeChart() {
  try {
    const response = await fetch('assets/churn.json');
    if (!response.ok) return;
    const data = await response.json();
    contract.addEventListener('change', () => renderChart(data));
    renderChart(data);
    contract.disabled = false;
  } catch (error) {
    console.warn('The contract filter could not load.', error);
  }
}

function renderChart(data) {
  const cohort = data[contract.value];
  const total = serviceTypes.reduce((sum, service) => sum + cohort[service][0], 0);
  rows.forEach((row, index) => {
    const [customers, churned] = cohort[serviceTypes[index]];
    const rate = (churned / customers * 100).toFixed(1) + '%';
    row.querySelector('i').style.setProperty('--size', rate);
    row.querySelector('strong').textContent = rate;
    row.title = `${churned.toLocaleString('en-US')} of ${customers.toLocaleString('en-US')} customers churned`;
  });
  sample.textContent = `${total.toLocaleString('en-US')} customers · ${contract.value}`;
}

initializeChart();
