import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/svelte'

import Board from "./Board.svelte"

describe("Board", () => {

  test('clicking a tile changes the tile value', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])

    expect(tiles[0]).toHaveTextContent('X')
  })

  test('playerRole changes after very click', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[1])

    expect(tiles[1]).toHaveTextContent('O')
  })

  test('game ends when there are three of the same in one row', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')

    // row win
    await fireEvent.click(tiles[3])
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[4])
    await fireEvent.click(tiles[8])
    await fireEvent.click(tiles[5])

    expect(screen.getByText('X wins!')).toBeInTheDocument()
  })
  test('game ends when there are three of the same in one column', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')

    // column win
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[4])
    await fireEvent.click(tiles[3])
    await fireEvent.click(tiles[7])
    await fireEvent.click(tiles[6])

    expect(screen.getByText('X wins!')).toBeInTheDocument()
  })
  test('game ends when there are three of the same in a diagonal', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')

    // diagonal win
    await fireEvent.click(tiles[2])
    await fireEvent.click(tiles[8])
    await fireEvent.click(tiles[6])
    await fireEvent.click(tiles[7])
    await fireEvent.click(tiles[4])

    expect(screen.getByText('X wins!')).toBeInTheDocument()
  })
  test('game ends when the board is full', async () => {
    render(Board, { playerRole: 'X', mode: 'multi', selections: ["", "", "", "", "", "", "", "", ""] })
    const tiles = screen.queryAllByRole('button')

    // full board
    await fireEvent.click(tiles[4])
    await fireEvent.click(tiles[3])
    await fireEvent.click(tiles[1])
    await fireEvent.click(tiles[7])
    await fireEvent.click(tiles[6])
    await fireEvent.click(tiles[2])
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[8])
    await fireEvent.click(tiles[5])

    expect(screen.getByText('Tie')).toBeInTheDocument()
  })
  describe('ai', () => {
    test('ai bot clicks after user clicks', async () => {
      render(Board, { playerRole: 'X', mode: 'single', selections: ["", "", "", "", "", "", "", "", ""] })
      let tiles = screen.queryAllByRole('button')

      await fireEvent.click(tiles[0])
      await new Promise((r) => setTimeout(r, 1000));
      const tileValues = tiles.map((tile) => tile.innerHTML)
      expect(tileValues).toContain('O');
    })
    test('ai bot selects optimal tile', async () => {
      render(Board, { playerRole: 'X', mode: 'single', selections: ["", "", "", "", "", "", "", "", ""] })
      let tiles = screen.queryAllByRole('button')

      await fireEvent.click(tiles[4])
      await new Promise((r) => setTimeout(r, 1000));
      await fireEvent.click(tiles[6])
      await new Promise((r) => setTimeout(r, 1000));

      expect(tiles[2].innerHTML).toEqual('O')
    })
  })
})