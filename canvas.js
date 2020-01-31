var rows = 25;
var cols = 30;
var minHeight = 100;
var minX = -450;
var cells;
var canvas;
var ctx;

noise.seed(Math.random());

function createCanvas(){
    canvas = document.createElement("canvas");
    this.document.querySelector("body").style.padding = 0;
    this.document.querySelector("body").style.margin = 0;
    this.document.querySelector("html").style.padding = 0;
    
    this.canvas.height = this.window.innerHeight;
    this.canvas.width = this.window.innerWidth;
    this.document.querySelector("body").appendChild(canvas);
    let fov = this.rows * 10;
    this.cells = new Array(rows);
    for(i = 0; i < rows; i++){
        this.cells[i] = [cols+1];
        let dist = (rows - i * 2) * i;
        fov = fov - this.rows;
        for(j = 0; j <= cols; j++){   
            let perspective = j * (canvas.width + 300) / cols; 
            if(j > 0)
                perspective += i * j;
            let diff = parseInt(noise.perlin2(Math.random() / 100, Math.random() / 100) * 1024);
            
            this.cells[i][j] = {
                maxNoise: minHeight +  i * (canvas.height + 200) / rows + diff - dist,
                minNoise: minHeight +  i * (canvas.height + 200) / rows - diff - dist,
                increasing: Math.random() > 0.5 ? true : false,
                x : minX + perspective + fov,
                y : minHeight + i * (canvas.height + 200) / rows - dist
            }
        }
    }
    ctx = canvas.getContext('2d');
    setInterval(this.draw, 20);
}

function draw(){
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#66BBFF";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.moveTo(0,0);

    for(i = 0; i < rows; i++){
        for(j = 0; j <= cols; j++){
            if(this.cells[i][j].increasing){
                this.cells[i][j].y = Math.min(this.cells[i][j].y + 0.2, this.cells[i][j].maxNoise);
                if(this.cells[i][j].y >= this.cells[i][j].maxNoise)
                    this.cells[i][j].increasing = false;
            }else {
                this.cells[i][j].y = Math.max(this.cells[i][j].y - 0.2, this.cells[i][j].minNoise);
                if(this.cells[i][j].y <= this.cells[i][j].minNoise)
                    this.cells[i][j].increasing = true;
            }
        }
    } 

    for(i = 0; i < rows; i++){
        for(j = 0; j <= cols; j++){
            ctx.moveTo(this.cells[i][j].x, this.cells[i][j].y);
            try{
                ctx.lineTo(this.cells[i][j+1].x, this.cells[i][j+1].y);
            }catch(error){}
            try{
                if(j < cols - 1)
                    ctx.lineTo(this.cells[i+1][j+1].x, this.cells[i+1][j+1].y);
            }catch(error){} 
        }
    }

    ctx.lineWidth = 1;
    ctx.strokeStyle = '#FFFFFF99';

    for(i = 0; i < rows; i++){
        for(j = 0; j <= cols; j++){
            ctx.moveTo(this.cells[i][j].x, this.cells[i][j].y);
            try{
                ctx.lineTo(this.cells[i][j-1].x, this.cells[i][j-1].y);
            }catch(error){}
            try{
                if(j < cols - 1)
                    ctx.lineTo(this.cells[i-1][j-1].x, this.cells[i-1][j-1].y);
            }catch(error){} 
        }
    }

    ctx.fillStyle = "#59CDFF";
    ctx.fill();
    
    ctx.stroke();
    
}