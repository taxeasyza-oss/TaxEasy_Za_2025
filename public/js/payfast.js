class PayFast {
  pay() {
    const amount = '9900'; // R99
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'https://www.payfast.co.za/eng/process';
    form.innerHTML = `
      <input type="hidden" name="merchant_id" value="10000100">
      <input type="hidden" name="merchant_key" value="46f0cd694581a">
      <input type="hidden" name="amount" value="${amount}">
      <input type="hidden" name="item_name" value="Tax Report PDF">
      <input type="hidden" name="return_url" value="${window.location.origin}/payment-success">
      <input type="hidden" name="cancel_url" value="${window.location.origin}/payment-cancelled">
    `;
    document.body.appendChild(form);
    form.submit();
  }
}
window.payFast = new PayFast();