import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

class Square extends React.Component {
  render() {
    return (
      <button className="square" onClick={() => this.props.onClick()}>
        {this.props.value}
      </button>
    );
  }
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
    squares[i] = 'X';
    this.setState({squares: squares});
  }

  renderSquare(i) {
    return <Square value={this.state.squares[i]} onClick={() => this.handleClick(i)} />;
  }

  render() {
    const status = 'Next player: X';

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
