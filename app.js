
const state={data:null,letter:"ALL",q:"",cat:"ALL"};
const $=s=>document.querySelector(s);
function esc(s){return String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]))}
function render(){
  const all=state.data.products||[];
  const q=state.q.trim().toLowerCase();
  const list=all.filter(p=>{
    const l=state.letter==="ALL"||String(p.name).trim().toUpperCase().startsWith(state.letter);
    const c=state.cat==="ALL"||p.category===state.cat;
    const s=!q||`${p.name} ${p.code} ${p.category}`.toLowerCase().includes(q);
    return l&&c&&s;
  });
  $("#count").textContent=`แสดง ${list.length} เกม`;
  $("#grid").innerHTML=list.map(p=>{
    const stock=Number(p.stock||0);
    const cover=p.image?`<img src="${esc(p.image)}" alt="${esc(p.name)}" loading="lazy">`:`<div>🎮<br>NO COVER</div>`;
    return `<article class="card">
      <div class="cover">${cover}</div>
      <div class="info">
        <div class="name">${esc(p.name)}</div>
        <div class="code">${esc(p.code||"")}</div>
        <div class="row"><div class="price">${Number(p.price||0).toLocaleString("th-TH")} บาท</div>
        <div class="stock ${stock<=0?"out":""}">${stock>0?"มีสินค้า":"หมด"}</div></div>
        <a class="buy" href="${state.data.shop.line_url||"#"}">ติดต่อร้าน</a>
      </div>
    </article>`;
  }).join("")||`<div class="empty">ไม่พบเกมที่ค้นหา</div>`;
}
function setLetter(x){
  state.letter=x;
  document.querySelectorAll(".letter").forEach(b=>b.classList.toggle("active",b.dataset.l===x));
  render();
}
fetch("products.json").then(r=>r.json()).then(d=>{
  state.data=d;
  $("#shopName").textContent=d.shop.name;
  $("#shopSub").textContent=d.shop.subtitle;
  const cats=[...new Set(d.products.map(p=>p.category))];
  $("#tabs").innerHTML=`<button class="tab active" data-c="ALL">ทั้งหมด</button>`+
    cats.map(c=>`<button class="tab" data-c="${esc(c)}">${esc(c)}</button>`).join("");
  $("#tabs").addEventListener("click",e=>{
    const b=e.target.closest(".tab"); if(!b)return;
    state.cat=b.dataset.c;
    document.querySelectorAll(".tab").forEach(x=>x.classList.toggle("active",x===b));
    render();
  });
  const letters="ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
  $("#letters").innerHTML=`<button class="letter active" data-l="ALL">ทั้งหมด</button>`+
    letters.map(x=>`<button class="letter" data-l="${x}">${x}</button>`).join("");
  $("#letters").addEventListener("click",e=>{const b=e.target.closest(".letter");if(b)setLetter(b.dataset.l)});
  $("#search").addEventListener("input",e=>{state.q=e.target.value;render()});
  render();
}).catch(()=>$("#grid").innerHTML='<div class="empty">โหลดข้อมูลแคตตาล็อกไม่สำเร็จ</div>');
