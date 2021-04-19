const canvas=document.querySelector("canvas");
const c = canvas.getContext("2d")

canvas.width = innerWidth;
canvas.height = innerHeight;
setTimeout(begin,3000)
function begin(){
  setTimeout(begin2,1000)
  document.querySelector(".tutorial").classList.add("opacity")
  document.querySelector(".score").classList.remove("opacity")
}
function begin2(){
  document.querySelector(".tutorial").classList.add("hide")
}
function final(){
  document.querySelector(".final-score").classList.remove("opacity")
}
let dificulty = 1;
class Player {
  constructor(x,y,radius,color){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
  }
  draw() {
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle=this.color;
    c.fill();
  }
}

class Projectile{
  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle=this.color;
    c.fill();
  }
  update(){
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.draw()
  }
}

class Enemy{
  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
  }
  draw() {
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle=this.color;
    c.fill();
  }
  update(){
    this.x = this.x + this.velocity.x*dificulty;
    this.y = this.y + this.velocity.y*dificulty;
    this.draw()
  }
}

const friction = 0.99
class Explosion{
  constructor(x,y,radius,color,velocity){
    this.x=x;
    this.y=y;
    this.radius=radius;
    this.color=color;
    this.velocity=velocity;
    this.alpha=1;
  }
  draw() {
    c.save()
    c.globalAlpha = this.alpha;
    c.beginPath();
    c.arc(this.x,this.y,this.radius,0,Math.PI*2,false);
    c.fillStyle=this.color;
    c.fill();
    c.restore()
  }
  update(){
    this.velocity.x *=friction
    this.velocity.y *=friction
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.draw()
    this.alpha -=0.01
  }
}

const x = canvas.width /2;
const y = canvas.height /2;
const player = new Player(x,y,10,"white")

const projectiles = []
const enemies = []
const explosions =[];
let score=0;
let scoreBoard= document.querySelector("span");


function animate(){
  animationId=requestAnimationFrame(animate)
  c.fillStyle="rgba(0,0,0,0.05)"
  c.fillRect(0,0,canvas.width,canvas.height)
  player.draw()
  scoreBoard.innerHTML=score;
  explosions.forEach((explosion,index) =>{
    if(explosion.alpha <= 0){
      explosions.splice(index,1)
    }else{
      explosion.update();
    }
    
  })
  projectiles.forEach((projectile)=>{projectile.update()})
  enemies.forEach((enemy,enemyIndex)=>{
    enemy.update()
    const distanceFromPlayer = Math.hypot(player.x-enemy.x,player.y-enemy.y)
    if(distanceFromPlayer-enemy.radius-player.radius<-1){
      cancelAnimationFrame(animationId)
      document.querySelector(".top-score").innerHTML = score;
      document.querySelector(".final-score").classList.remove("hide")
      document.querySelector(".score").classList.add("hide")
      setTimeout(final,200)
    }
    projectiles.forEach((projectile,projectilesIndex)=>{
      const distanceFromEnemy = Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
      if(distanceFromEnemy-enemy.radius-projectile.radius<-1){
        for (let i = 0; i < enemy.radius*2; i++) {
          explosions.push(new Explosion(projectile.x,projectile.y,Math.random()*2,enemy.color,{x:(Math.random()-0.5)*6*Math.random(),y:(Math.random()-0.5)*6*Math.random()}))
        }
        if(enemy.radius-10>9){
          gsap.to(enemy,{radius:enemy.radius-10})
          
          setTimeout(()=>{
            projectiles.splice(projectilesIndex,1)
            
        },0)
        }else{
          score+=100
          dificulty+=0.1
          setTimeout(()=>{
            enemies.splice(enemyIndex,1)
            projectiles.splice(projectilesIndex,1)
        },0)}
        
      }
      if(projectile.x>canvas.width||projectile.x<0||projectile.y>canvas.height||projectile.y<0){
        projectiles.splice(projectilesIndex,1)
        score-=10
      }
    })
  })
}

setInterval(spawnNewEnemy,2000)
function spawnNewEnemy(){
  
  const enemyRadius = 30;
  let enemySpawnLocationX
  let enemySpawnLocationY

  if(Math.random() <0.25){
    enemySpawnLocationX = 0-enemyRadius;
    enemySpawnLocationY = Math.random()*canvas.height;
  }else if(Math.random()<0.5){
    enemySpawnLocationX = canvas.width+enemyRadius;
    enemySpawnLocationY = Math.random()*canvas.height;
  }else if(Math.random()<0.75){
    enemySpawnLocationX = Math.random()*canvas.width
    enemySpawnLocationY = 0-enemyRadius;
  }else{
    enemySpawnLocationX = Math.random()*canvas.width
    enemySpawnLocationY = canvas.height+enemyRadius;
  }

  const color = `hsl(${Math.random()*360},80%,50%)`
  const enemyDirection = Math.atan2(y-enemySpawnLocationY,x-enemySpawnLocationX)
  const velocity = {
    x:Math.cos(enemyDirection),
    y:Math.sin(enemyDirection)
  }
  enemies.push(new Enemy(enemySpawnLocationX,enemySpawnLocationY,enemyRadius,color,velocity))
}

addEventListener("mousedown", shoot);
function shoot(event){
  console.log(projectiles);
  const projectileAngle = Math.atan2(event.clientY-y,event.clientX-x)
  const velocity = {
    x:Math.cos(projectileAngle)*5,
    y:Math.sin(projectileAngle)*5
  }
  
  projectiles.push(new Projectile(x,y,5,"white",velocity))
}

animate()