(function(){
  var c=document.getElementById('gl');
  if(!window.THREE||!c)return;
  var r;
  try{r=new THREE.WebGLRenderer({canvas:c,alpha:true,antialias:true});}catch(e){return;}
  var still=matchMedia('(prefers-reduced-motion: reduce)').matches;
  r.setPixelRatio(Math.min(devicePixelRatio||1,2));
  var sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(50,1,.1,100);cam.position.z=9;
  sc.add(new THREE.AmbientLight(0xffffff,.7));
  var pl=new THREE.PointLight(0xff2d87,1.6,60);pl.position.set(3,4,7);sc.add(pl);
  var pl2=new THREE.PointLight(0x14b8a6,1.2,60);pl2.position.set(-5,-3,6);sc.add(pl2);
  function mat(col){return new THREE.MeshStandardMaterial({color:col,metalness:.35,roughness:.3,emissive:col,emissiveIntensity:.3,transparent:true,opacity:.92});}
  var base=[0xff2d87,0x14b8a6,0xf5c542].map(function(x){return new THREE.Color(x);}),redC=new THREE.Color(0xff3b3b);
  var grp=new THREE.Group();sc.add(grp);
  var ring=new THREE.Mesh(new THREE.TorusGeometry(1.2,.3,24,64),mat(0xff2d87));
  var tri=new THREE.Mesh(new THREE.ConeGeometry(1.5,2.4,3),mat(0x14b8a6));
  var box=new THREE.Mesh(new THREE.BoxGeometry(1.8,1.8,1.8),mat(0xf5c542));
  var objs=[ring,tri,box];objs.forEach(function(m){grp.add(m);});
  var n=140,pos=new Float32Array(n*3);
  for(var i=0;i<n;i++){pos[i*3]=(Math.random()-.5)*26;pos[i*3+1]=(Math.random()-.5)*14;pos[i*3+2]=(Math.random()-.5)*8-2;}
  var pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
  var pts=new THREE.Points(pg,new THREE.PointsMaterial({color:0xf4eee2,size:.05,transparent:true,opacity:.55}));sc.add(pts);
  function place(){
    var w=c.clientWidth||1,h=c.clientHeight||1;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();
    var a=Math.min(w/h,1.8);
    ring.position.set(-a*3.4,2.6,-1);ring.userData.y0=2.6;
    tri.position.set(a*3.4,2.5,-1);tri.userData.y0=2.5;
    box.position.set(-a*2.8,-2.7,-1);box.userData.y0=-2.7;
  }
  place();window.addEventListener('resize',place);
  var mx=0,my=0,spin=1,t=0,vis=true;
  window.addEventListener('pointermove',function(e){mx=e.clientX/innerWidth*2-1;my=e.clientY/innerHeight*2-1;});
  if('IntersectionObserver' in window)new IntersectionObserver(function(en){vis=en[0].isIntersecting;}).observe(c);
  function frame(){
    if(!still)requestAnimationFrame(frame);
    if(!vis)return;
    t+=.016;
    var isRed=!!window.__red;
    spin+=((isRed?0:1)-spin)*.12;
    objs.forEach(function(m,i){
      m.rotation.x+=.007*spin*(i+1);m.rotation.y+=.011*spin;
      m.position.y=m.userData.y0+Math.sin(t*1.2+i*2)*.28*(still?0:1);
      var col=isRed?redC:base[i];m.material.color.lerp(col,.15);m.material.emissive.lerp(col,.15);
    });
    pts.rotation.y+=.0006*spin;
    grp.rotation.y+=(mx*.3-grp.rotation.y)*.05;grp.rotation.x+=(my*.18-grp.rotation.x)*.05;
    r.render(sc,cam);
  }
  frame();
})();
