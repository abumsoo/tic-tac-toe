import '@testing-library/jest-dom'
import { render, fireEvent, screen } from '@testing-library/svelte'

import Board from "./Board.svelte"

describe("Board", () => {

  test('clicking a tile changes the tile value', async () => {
    render(Board, { playerRole: 'X' })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])

    expect(tiles[0]).toHaveTextContent('X')
  })

  test('playerRole changes after very click', async () => {
    render(Board, { playerRole: 'X' })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[1])

    expect(tiles[1]).toHaveTextContent('O')
  })

  test('game ends when there are three of the same in one row', async () => {
    render(Board, { playerRole: 'X' })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[4])
    await fireEvent.click(tiles[1])
    await fireEvent.click(tiles[5])
    await fireEvent.click(tiles[2])

    expect(screen.getByText('X wins!')).toBeInTheDocument()
  })
  test('game ends when there are three of the same in one column', async () => {
    render(Board, { playerRole: 'X' })
    const tiles = screen.queryAllByRole('button')
    await fireEvent.click(tiles[0])
    await fireEvent.click(tiles[4])
    await fireEvent.click(tiles[3])
    await fireEvent.click(tiles[7])
    await fireEvent.click(tiles[6])

    expect(screen.getByText('X wins!')).toBeInTheDocument()
  })
  test('game ends when there are three of the same in a diagonal')
})