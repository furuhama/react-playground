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
  constructor(props) {
    super(props);
    this.state = {
      squares: Array(9).fill(null),
      xIsNext: true,
    }
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
    const squares = this.state.squares.slice();
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      squares: squares,
      xIsNext: !this.state.xIsNext,
    });
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');

    return (
      <div>
        <div className="status">{status}</div>
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
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
