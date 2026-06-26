// More Lake — form handling
// Newsletter signup  -> Shopify customer list (marketing opt-in) via the Storefront API
// Contact / wholesale -> Web3Forms -> hello@morelake.org
(function () {
  var SHOP = 'cgc10s-wr.myshopify.com';
  var TOKEN = 'ea864748ef8052ec1c69f23bfa16587c';   // public Storefront token (Headless channel)
  var WEB3_KEY = '3f35a8c9-76d6-4d2f-8f56-b1a1f8b7fd10'; // web3forms.com access key -> hello@morelake.org

  function flash(btn, text, ms, orig) {
    btn.textContent = text;
    setTimeout(function () { btn.textContent = orig; btn.disabled = false; }, ms || 2200);
  }

  // ---- Newsletter -> Shopify customer list ----
  function joinList(email) {
    var pw = 'ML' + Math.random().toString(36).slice(2) + 'Aa9!';
    var q = 'mutation($i:CustomerCreateInput!){customerCreate(input:$i){customer{id}customerUserErrors{message}}}';
    return fetch('https://' + SHOP + '/api/2024-01/graphql.json', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Storefront-Access-Token': TOKEN },
      body: JSON.stringify({ query: q, variables: { i: { email: email, password: pw, acceptsMarketing: true } } })
    }).then(function (r) { return r.json(); }).then(function (j) {
      var d = j && j.data && j.data.customerCreate, errs = (d && d.customerUserErrors) || [];
      if (d && d.customer) return { ok: true };
      // already on the list -> treat as success, not an error
      if (errs.some(function (e) { return /taken|already/i.test(e.message || ''); })) return { ok: true };
      return { ok: false };
    }).catch(function () { return { ok: false }; });
  }

  document.querySelectorAll('form.emailbar').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var inp = f.querySelector('input[type=email]'), b = f.querySelector('button'), orig = b.textContent;
      var email = ((inp && inp.value) || '').trim();
      if (!email) return;
      b.disabled = true; b.textContent = '…';
      joinList(email).then(function (res) {
        if (res.ok && inp) inp.value = '';
        flash(b, res.ok ? 'THANKS' : 'TRY AGAIN', 2200, orig);
      });
    });
  });

  // ---- Contact / wholesale -> Web3Forms -> hello@morelake.org ----
  var keyReady = WEB3_KEY && WEB3_KEY.indexOf('YOUR_') !== 0;
  document.querySelectorAll('form[data-mock]').forEach(function (f) {
    f.addEventListener('submit', function (e) {
      e.preventDefault();
      var b = f.querySelector('button[type=submit]') || f.querySelector('button'), orig = b.textContent;
      if (!keyReady) { flash(b, 'EMAIL HELLO@MORELAKE.ORG', 2800, orig); return; }
      b.disabled = true; b.textContent = 'SENDING…';
      var fd = new FormData(f);
      fd.append('access_key', WEB3_KEY);
      fd.append('subject', f.getAttribute('data-subject') || 'More Lake — form submission');
      fd.append('from_name', 'More Lake site');
      fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Accept': 'application/json' }, body: fd })
        .then(function (r) { return r.json(); })
        .then(function (j) { if (j.success) f.reset(); flash(b, j.success ? 'SENT ✓' : 'TRY AGAIN', 2800, orig); })
        .catch(function () { flash(b, 'TRY AGAIN', 2800, orig); });
    });
  });
})();
