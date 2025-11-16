/* app.js - Cliente simple para Registrar / Listar pagos
   - Proyecto demo: envía POST y GET a un backend REST
   - Archivo está completamente comentado para aprender
*/

// Configuración del endpoint API
// Ajustá esta URL si tu backend está en otro puerto o ruta.
// Nota: el backend de ejemplo generado por Copilot usa rutas tipo /api/payments
const API_BASE = 'http://localhost:5230/api/payments';

// ----- Utilidades DOM -----
const form = document.getElementById('paymentForm');
const tblBody = document.querySelector('#paymentsTable tbody');
const btnReset = document.getElementById('btnReset');

// Inputs
const inputCustomer = document.getElementById('customerName');
const inputItem = document.getElementById('item');
const inputAmount = document.getElementById('amount');
const selectStatus = document.getElementById('status');

// Inicialización: cuando carga la página, traer la lista de pagos
document.addEventListener('DOMContentLoaded', () => {
  // Cargar y mostrar pagos existentes
  fetchPayments();

  // Bind al formulario
  form.addEventListener('submit', handleSubmit);
  btnReset.addEventListener('click', resetForm);
});

// ----- Función que trae los pagos desde el backend y los renderiza -----
async function fetchPayments() {
  try {
    // Petición GET al endpoint
    const res = await fetch(API_BASE, { method: 'GET' });
    if (!res.ok) throw new Error('Error al obtener pagos: ' + res.status);

    const data = await res.json();

    // Renderizar la tabla con los pagos
    renderTable(data || []);
  } catch (err) {
    console.error(err);
    alert('No se pudieron cargar los pagos. Ver consola para más detalles.');
  }
}

// ----- Renderizar filas de la tabla -----
function renderTable(items) {
  // Limpiar cuerpo
  tblBody.innerHTML = '';

  if (!items || items.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 6;
    td.textContent = 'No hay pagos registrados';
    td.style.padding = '16px';
    tr.appendChild(td);
    tblBody.appendChild(tr);
    return;
  }

  // Crear fila por cada pago
  items.forEach(item => {
    const tr = document.createElement('tr');

    const tdId = document.createElement('td');
    tdId.textContent = item.id != null ? String(item.id) : '-';

    const tdName = document.createElement('td');
    tdName.textContent = item.customerName || '-';

    const tdItem = document.createElement('td');
    tdItem.textContent = item.item || '-';

    const tdAmount = document.createElement('td');
    // Formatear moneda en ARS (si el navegador lo soporta)
    try {
      tdAmount.textContent = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(Number(item.amount));
    } catch (e) {
      tdAmount.textContent = item.amount;
    }

    const tdDate = document.createElement('td');
    // Mostrar fecha en local
    tdDate.textContent = item.date ? new Date(item.date).toLocaleString() : '-';

    const tdStatus = document.createElement('td');
    tdStatus.textContent = item.status || '-';

    tr.append(tdId, tdName, tdItem, tdAmount, tdDate, tdStatus);
    tblBody.appendChild(tr);
  });
}

// ----- Manejar envío del formulario -----
async function handleSubmit(event) {
  event.preventDefault();

  // Validaciones simples en cliente
  const customer = inputCustomer.value.trim();
  const product = inputItem.value.trim();
  const amountVal = inputAmount.value;
  const statusVal = selectStatus.value;

  if (!customer) { alert('Completar nombre del cliente'); inputCustomer.focus(); return; }
  if (!product) { alert('Completar producto'); inputItem.focus(); return; }
  if (!amountVal || Number(amountVal) <= 0) { alert('Ingresar un monto válido'); inputAmount.focus(); return; }

  // Construir payload JSON
  const payload = {
    customerName: customer,
    item: product,
    amount: Number(Number(amountVal).toFixed(2)),
    // Fecha autogenerada en ISO (backend puede ignorar y asignar la suya propia)
    date: new Date().toISOString(),
    status: statusVal || 'Pending'
  };

  try {
    // Enviar POST al backend
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!res.ok) {
      // Observar 4xx/5xx
      const text = await res.text();
      throw new Error('Error en POST: ' + res.status + ' - ' + text);
    }

    // Respuesta OK: notificar al usuario
    alert('Pago registrado con éxito');

    // Limpiar formulario
    resetForm();

    // Refrescar la tabla (llamado a GET)
    await fetchPayments();

  } catch (err) {
    console.error(err);
    alert('Error al registrar el pago. Revisa la consola y que el backend esté activo.');
  }
}

// ----- Limpiar campos del formulario -----
function resetForm() {
  form.reset();
  // Ajustar select al primer valor
  if (selectStatus) selectStatus.value = 'Pending';
}

// Exportar funciones para testing si se cargara como módulo (opcional)
window.paymentsApp = {
  fetchPayments,
  renderTable,
  handleSubmit
};
