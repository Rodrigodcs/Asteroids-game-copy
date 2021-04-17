const canvas=document.querySelector("canvas");
const c = canvas.getContext("2d")

canvas.width = innerWidth;
canvas.height = innerHeight;

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
    this.x = this.x + this.velocity.x;
    this.y = this.y + this.velocity.y;
    this.draw()
  }
}

const x = canvas.width /2;
const y = canvas.height /2;
const player = new Player(x,y,10,"white")

const projectiles = []
const enemies = []

function animate(){
  animationId=requestAnimationFrame(animate)
  c.fillStyle="rgba(0,0,0,0.05)"
  c.fillRect(0,0,canvas.width,canvas.height)
  player.draw()
  projectiles.forEach((projectile)=>{projectile.update()})
  enemies.forEach((enemy,enemyIndex)=>{
    enemy.update()
    const distanceFromPlayer = Math.hypot(player.x-enemy.x,player.y-enemy.y)
    if(distanceFromPlayer-enemy.radius-player.radius<-1){
      cancelAnimationFrame(animationId)
    }
    projectiles.forEach((projectile,projectilesIndex)=>{
      const distanceFromEnemy = Math.hypot(projectile.x-enemy.x,projectile.y-enemy.y)
      if(distanceFromEnemy-enemy.radius-projectile.radius<-1){
        if(enemy.radius-10>9){
          gsap.to(enemy,{radius:enemy.radius-10})
          
          setTimeout(()=>{
            projectiles.splice(projectilesIndex,1)
        },0)
        }else{
          setTimeout(()=>{
            enemies.splice(enemyIndex,1)
            projectiles.splice(projectilesIndex,1)
        },0)}
        
      }
      if(projectile.x>canvas.width||projectile.x<0||projectile.y>canvas.height||projectile.y<0){
        projectiles.splice(projectilesIndex,1)
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