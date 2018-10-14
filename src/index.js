import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

// MEMO: Square はもう自身で state を持たなくともよくなったため
// Function Component に書き換えた
// class Square extends React.Component {
//   render() {
//     return (
//       <button className="square" onClick={() => this.props.onClick()}>
//         {this.props.value}
//       </button>
//     );
//   }
// }

// MEMO: React.Component を extend した class ではなく
// function を用いた Function Component に置き換えることで
// 自身は state を持たず、 props を引数として取る
// 副作用のない関数型のコンポーネントとすることができる
//
// ちなみに
// onClick={() => this.props.onClick()} は
// onClick={props.onClick} と書き換えることができる
// これによって this 句の振る舞いの違いに悩まされなくなるらしい
function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  // MEMO: Square がそれぞれ自身の状態を管理するよりも
  // Board が一括してそれらを管理する構造の方が
  // 今回の目的としてはいいっぽい
  // (Board 全体でゲームの状態が変化するため)
  //
  // と、思ったけど、 Board の状態遷移を Game が管理したい仕様になったので
  // さらに状態を持つのが Game にまで移った
  renderSquare(i) {
    return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
      }],
      xIsNext: true,
    };
  }

  // MEMO: state を mutable なオブジェクトと見做して
  // 直接値を変化させていくと、副作用主体の処理になり
  // どこで値が変化して現在の状態になっているのかわかりづらくなる
  // immutable なオブジェクトで置き換える方法ならば、現在の state が
  // どのオブジェクトなのかを調べることで参照透明的な性質を持つようになる
  //
  // また、 immurable なオブジェクトを用いることでレンダリングにおける
  // 最適化も行いやすくなるみたい
  // https://reactjs.org/docs/optimizing-performance.html#examples
  handleClick(i) {
    const history = this.state.history;
    const current = history[history.length - 1];
    // history や current 全体をコピーすることはせずに
    // 最低限の配列のみをコピーする
    const squares = current.squares.slice();

    // 既に winner が存在する、もしくはクリックした Square が埋まっている場合は何もしない
    if (calculateWinner(squares) || squares[i]) {
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      // state.history に対して破壊的な操作は加えずに、
      // concat によって新しい {squares: squares} を加えた配列を作成
      // それを state.history に置き換えている
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const current = history[history.length - 1];
    const winner = calculateWinner(current.squares);

    let status;
    if (winner) {
      status = 'Winner: ' + winner;
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board squares={current.squares} onClick={(i) => this.handleClick(i)} />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
