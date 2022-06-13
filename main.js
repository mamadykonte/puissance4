class Draw {
  drawToken = (element, playerName, player,score) => {
    console.log(score);
    let div = document.createElement("div");
    div.classList.add("player" + player);
    let h2 = document.createElement("h2");
    let h3 = document.createElement("h3");
    h2.textContent = playerName;
    h3.textContent = `${score}`;
    let token = document.createElement("div");
    token.classList.add("circle");
    token.classList.add("colorPlayer" + player);
    div.appendChild(h2);
    div.appendChild(token);
    div.appendChild(h3);
    element.appendChild(div);
  };

  render = (element, rows, cols, grid) => {
    let table = document.createElement("table");

    for (let i = rows - 1; i >= 0; i--) {
      let tr = table.appendChild(document.createElement("tr"));
      for (let j = 0; j < cols; j++) {
        let td = tr.appendChild(document.createElement("td"));
        let content = grid[i][j];
        
        if (content === 1){
          td.classList.add("colorPlayer1"); 
          td.classList.add("anim");
        } 
        else if (content === 2){
          td.classList.add("colorPlayer2");
          td.classList.add("anim");
        } 
       
        td.dataset.column = j;
        let r = rows-i - 1;
        td.id = "case" + j + i;
      }
    }
    element.appendChild(table);
    if (document.querySelectorAll("table").length > 1) {
      document.querySelector("table").remove();
    }
  };

  bntReset = (element,player) => {
    let div = document.createElement("div");
    div.classList.add("reset");
    let h2 = document.createElement("h2");
    console.log("player",player);
    h2.textContent = player;
    let btn = document.createElement("button");
    btn.textContent = "Reset";
  div.appendChild(h2);
    div.appendChild(btn);

    btn.classList.add("bntReset");
    element.appendChild(div);
  };
}

class Game extends Draw {
 
  putTokenInGrid = ({ grid, colIndex, token, tour }) => {
    let box;
    for (let i = 0; i < grid.length; i++) {
      if (grid[i][colIndex] === 0) {
        grid[i][colIndex] = token;
        tour = tour++;
        box = i;
        break;
      }
    }
    if (box === undefined) {
      return "full";
    }

    return box;
  };

  win(row, column, player) {
    // Horizontal
    console.log("rowwin", row)
    let count = 0;
    for (let j = 0; j < this.cols; j++) {
      count = this.grid[row][j] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
  
    // Vertical
    count = 0;
    for (let i = 0; i < this.rows; i++) {
      count = this.grid[i][column] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Diagonal
    count = 0;
    let shift = row - column;
    for (
      let i = Math.max(shift, 0);
      i < Math.min(this.rows, this.cols + shift);
      i++
    ) {
      count = this.grid[i][i - shift] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }
    // Anti-diagonal
    count = 0;
    shift = row + column;
    for (
      let i = Math.max(shift - this.cols + 1, 0);
      i < Math.min(this.rows, shift + 1);
      i++
    ) {
      // console.log(i, shift - i, shift);
      count = this.grid[i][shift - i] == player ? count + 1 : 0;
      if (count >= 4) return true;
    }

    return false;
  }
}

class Puissance4 extends Game {
  constructor(
    element,
    row,
    col,
    idPlayer1,
    idPlayer2,
    colorPlayer1,
    colorPlayer2
  ) {
    super();
    this.element = element;
    this.rows = row;
    this.cols = col;
    this.grid = this.createArrayPuissance4(this.rows, this.cols, 0);
    this.idPlayer1 = idPlayer1;
    this.idPlayer2 = idPlayer2;
    this.colorPlayer1 = colorPlayer1;
    this.colorPlayer2 = colorPlayer2;
    this.currentPlayer = 1;
    this.winner = null;
    this.tour = 0;
    this.root = document.documentElement;
    this.score1 = 0;
    this.score2 = 0;
    this.init();
  }
  

  createArrayPuissance4(rows, cols, defaultValue) {
    var arr = [];
    // Creates all lines:
    for (var i = 0; i < rows; i++) {
      // Creates an empty line
      arr.push([]);

      // Adds cols to the empty line:
      arr[i].push(new Array(cols));

      for (var j = 0; j < cols; j++) {
        // Initializes:
        arr[i][j] = defaultValue;
      }
    }

    return arr;
  }

  init = () => {

    this.element.innerHTML = "";
    this.drawToken(this.element, this.idPlayer1, 1, this.score1);
    this.render(this.element, this.rows, this.cols, this.grid);
    this.drawToken(this.element, this.idPlayer2, 2, this.score2);

    document.querySelectorAll("td").forEach((element) => {
      element.addEventListener("mouseover", (event) => {
        if (this.currentPlayer === 1) {
          element.classList.add("over1");
        } else if (this.currentPlayer === 2) {
          element.classList.add("over2");
        }
      });
      element.addEventListener("mouseout", (event) => {
        element.classList.remove("over1");
        element.classList.remove("over2");
      });
    });

    this.root.style.setProperty("--player1-color", this.colorPlayer1);
    this.root.style.setProperty("--player2-color", this.colorPlayer2);


    this.element.addEventListener("click", (event) => this.handleClick(event));
    this.element.addEventListener("dblclick", (event) => this.handleClickDouble(event));
  };

  reset = () => {
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        this.grid[i][j] = 0;
      }
    }
    this.tour = 0;
    this.winner = null;
  };

  goReset = (content) => {

    if (this.winner !== null) {
     
      this.bntReset(this.element,content);
      this.render(this.element, this.rows, this.cols, this.grid,this.tour);
      document.querySelector(".bntReset").addEventListener("click", () => {
        console.log("reset",this.tour);
        this.reset();
        this.render(this.element, this.rows, this.cols, this.grid);

        document.querySelector(".reset").remove();
      });
    }
  };


  handleClickDouble = (event) => {

   console.table("grid", this.grid);
  }
  handleClick = (event) => {
    console.log("score",this.score1, this.score2);
    if (this.currentPlayer === 2) {
      this.root.style.setProperty("--player1-opacity", 1);
      this.root.style.setProperty("--player2-opacity", 0.4);

      this.root.style.setProperty("--player1-order", 3);
      this.root.style.setProperty("--player2-order", 1);
    } else {
      this.root.style.setProperty("--player2-opacity", 1);
      this.root.style.setProperty("--player1-opacity", 0.4);

      this.root.style.setProperty("--player2-order", 3);
      this.root.style.setProperty("--player1-order", 1);
    }
 
    
    let column = parseInt(event.target.dataset.column);

    let putToken = this.putTokenInGrid({
      grid: this.grid,
      colIndex: column,
      token: this.currentPlayer,
      tour: this.tour,
    });

    let cibleColumn = document.getElementById(`case${column}${putToken}`);

    console.log("cibleColumn", `case${column}${putToken}`);
 
   
    if (putToken === "full") {
      return;
    } else {
      if (this.win(putToken, column, this.currentPlayer)) {
        this.winner = this.currentPlayer;
      } else if (this.moves >= this.rows * this.columns) {
        this.winner = 0;
      }
      this.currentPlayer = 3 - this.currentPlayer;

      this.render(this.element, this.rows, this.cols, this.grid);

      cibleColumn.classList.add("anim");

      switch (this.winner) {
        case 0:
          this.goReset("match nul: aucun joueur ne peut gagner ce tour");
          break;
        case 1:
          this.score1 += 1;
          this.goReset(`Le joueur ${this.idPlayer1} a gagné cette partie`);
          break;
        case 2:
          this.score2 += 1;
          this.goReset(`Le joueur ${this.idPlayer2} a gagné cette partie`);
          break;
      }
    }
  };
}
