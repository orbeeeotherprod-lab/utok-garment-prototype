'use strict';
const menu=document.querySelector('.menu-toggle'),nav=document.querySelector('.nav');
menu?.addEventListener('click',()=>{const expanded=menu.getAttribute('aria-expanded')==='true';menu.setAttribute('aria-expanded',String(!expanded));menu.setAttribute('aria-label',expanded?'Открыть меню':'Закрыть меню');nav.classList.toggle('open',!expanded)});
nav?.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Открыть меню')}));
document.addEventListener('keydown',e=>{if(e.key==='Escape'&&nav?.classList.contains('open')){nav.classList.remove('open');menu.setAttribute('aria-expanded','false');menu.setAttribute('aria-label','Открыть меню');menu.focus()}});
const privacy=document.getElementById('privacy-dialog');
document.querySelectorAll('.privacy-open').forEach(b=>{b.type='button';b.addEventListener('click',()=>privacy.showModal())});
document.getElementById('privacy-close')?.addEventListener('click',()=>privacy.close());
const form=document.getElementById('order-form');
if(form){
 let step=0; const sections=[...form.querySelectorAll('.form-step')],labels=['Задача','Объём','Готовность','Материалы','Сроки и файлы','Контакт и проверка'];
 const error=document.getElementById('form-error'),next=document.getElementById('next'),back=document.getElementById('back');
 const get=n=>new FormData(form).get(n)||'';
 const params=new URLSearchParams(location.search);
 if(['Футболки','Худи','Рубашки','Другое'].includes(params.get('category'))){[...form.elements.category].find(x=>x.value===params.get('category')).checked=true}
 if(['ready','idea','repeat'].includes(params.get('scenario')))form.elements.scenario.value=params.get('scenario');
 function updateRepeat(){document.getElementById('repeat-field').hidden=get('scenario')!=='repeat'}
 form.elements.scenario.addEventListener('change',updateRepeat);updateRepeat();
 const unknown=document.getElementById('unknown-volume');
 unknown.addEventListener('change',()=>{['models','quantity'].forEach(n=>{form.elements[n].disabled=unknown.checked;form.elements[n].required=!unknown.checked})});
 const date=document.getElementById('deadline');const now=new Date();date.min=[now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),String(now.getDate()).padStart(2,'0')].join('-');
 const files=document.getElementById('files');
 function fileError(){const selected=[...files.files];if(selected.length>3)return 'Выберите не больше 3 файлов.';if(selected.some(f=>f.size>10*1024*1024))return 'Каждый файл должен быть не больше 10 МБ.';if(selected.some(f=>!(/\.(pdf|png|jpe?g)$/i).test(f.name)))return 'Поддерживаются только PDF, JPG и PNG.';return ''}
 files.addEventListener('change',()=>{const message=fileError();files.setCustomValidity(message);document.getElementById('file-status').textContent=message||(files.files.length?'Выбрано файлов: '+files.files.length+'. Они не загружаются.':'');error.textContent=message});
 const channel=document.getElementById('channel'),contact=document.getElementById('contact');
 channel.addEventListener('change',()=>{const email=channel.value==='email';contact.type=email?'email':'tel';contact.placeholder=email?'name@example.com':'+996 …';contact.pattern=email?'':'[+0-9 ()-]{7,30}';document.getElementById('contact-label').textContent=email?'Email для связи':'Телефон для связи'});
 function review(){const rows=[['Изделие',get('category'),0],['Сценарий',{ready:'Есть ТЗ или образец',idea:'Нужна разработка',repeat:'Повторный тираж'}[get('scenario')],0],['Объём',unknown.checked?'Нужна помощь с объёмом':get('models')+' мод. · '+get('quantity')+' шт.',1],['Готовность',get('readiness'),2],['Материалы',get('material')+(get('finish')?' · '+get('finish'):''),3],['Срок и файлы',(get('deadline')||'Дата не задана')+(get('destination')?' · '+get('destination'):'')+' · '+files.files.length+' файл(а)',4]];const dl=document.getElementById('review');dl.replaceChildren();for(const [label,value,target]of rows){const row=document.createElement('div');row.className='review-row';const dt=document.createElement('dt');dt.textContent=label;const dd=document.createElement('dd');dd.textContent=value;const btn=document.createElement('button');btn.type='button';btn.textContent='Изменить';btn.setAttribute('aria-label','Изменить: '+label);btn.addEventListener('click',()=>show(target));row.append(dt,dd,btn);dl.append(row)}}
 function show(n){step=n;document.dispatchEvent(new CustomEvent("brief:step",{detail:{step:n}}));sections.forEach((s,i)=>s.hidden=i!==step);document.querySelectorAll('[data-nav]').forEach((el,i)=>{el.classList.toggle('active',i===step);el.classList.toggle('done',i<step);if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current')});document.getElementById('step-count').textContent='Шаг '+(step+1)+' из 6';document.getElementById('mobile-step').textContent='Шаг '+(step+1)+' из 6 · '+labels[step];document.getElementById('progress-fill').style.width=((step+1)/6*100)+'%';document.querySelector('.progress').setAttribute('aria-valuenow',String(step+1));next.textContent=step===5?'Завершить демо':'Продолжить →';back.textContent=step===0?'← На главную':'← Назад';error.textContent='';if(step===5)review();sections[step].querySelector('h2').focus({preventScroll:true});if(matchMedia('(max-width:800px)').matches)document.querySelector('.form-card').scrollIntoView({block:'start',behavior:'instant'})}
 function valid(){for(const el of sections[step].querySelectorAll('input,select,textarea')){if(!el.disabled&&!el.checkValidity()){error.textContent=el.validity.valueMissing?'Заполните обязательные поля, чтобы продолжить.':el.validationMessage;el.focus();return false}}return true}
 function advance(){if(!valid())return;if(step<5){show(step+1);return}document.getElementById('wizard').hidden=true;document.getElementById('success').hidden=false;document.getElementById('success').querySelector('h2').focus();}
 next.addEventListener('click',advance);form.addEventListener('submit',e=>{e.preventDefault();advance()});back.addEventListener('click',()=>step?show(step-1):location.assign("/utok-garment-prototype/"));
 document.getElementById('edit-again').addEventListener('click',()=>{document.getElementById('success').hidden=true;document.getElementById('wizard').hidden=false;show(5)});
 document.querySelector('[data-nav="0"]').setAttribute('aria-current','step');
}
