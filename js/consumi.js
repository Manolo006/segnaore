import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    import { getDatabase, ref, onValue } from 'https://www.gstatic.com/firebasejs/10.12.2/firebase-database.js';

    const firebaseConfig = {
      apiKey:            "AIzaSyCtJWFHpz_wSZd7pVxhUdNkGUNjuRXDexc",
      authDomain:        "in-punto.firebaseapp.com",
      databaseURL:       "https://in-punto-default-rtdb.europe-west1.firebasedatabase.app",
      projectId:         "in-punto",
      storageBucket:     "in-punto.firebasestorage.app",
      messagingSenderId: "851521503055",
      appId:             "1:851521503055:web:7e23520cf67641f044cf3a"
    };
    const fbApp = initializeApp(firebaseConfig);
    const db    = getDatabase(fbApp);

    let allOrders = [];

    const ordersRef = ref(db, 'orders');
    onValue(ordersRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) {
        document.getElementById('loader').style.display = 'none';
        return;
      }

      allOrders = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));

      calculateStats();
    });

    function calculateStats() {
      let totalRevenue = 0;
      let totalItemsSold = 0;
      let totalOrders = allOrders.length;

      const itemsMap = {};

      allOrders.forEach(order => {
        if(order.items) {
          order.items.forEach(item => {
            totalItemsSold += item.qty;
            const price = item.price || 0;
            totalRevenue += price * item.qty;

            if(!itemsMap[item.name]) {
              itemsMap[item.name] = { qty: 0, revenue: 0 };
            }
            itemsMap[item.name].qty += item.qty;
            itemsMap[item.name].revenue += price * item.qty;
          });
        }
      });

      document.getElementById('val-revenue').textContent = totalRevenue.toFixed(2) + ' €';
      document.getElementById('val-orders').textContent = totalOrders;
      document.getElementById('val-items').textContent = totalItemsSold;

      const sortedItems = Object.entries(itemsMap)
        .map(([name, data]) => ({ name, ...data }))
        .sort((a, b) => b.qty - a.qty);

      const listContainer = document.getElementById('itemsList');
      listContainer.innerHTML = sortedItems.map(item => `
        <div class="item-row">
          <div>
            <div class="item-row__name">${item.name}</div>
            <div class="item-row__revenue">Incasso: ${item.revenue.toFixed(2)} €</div>
          </div>
          <div class="item-row__qty">x${item.qty}</div>
        </div>
      `).join('');

      document.getElementById('loader').style.display = 'none';
      document.getElementById('statsContent').style.display = 'block';
    }