import { render, screen } from "@testing-library/react";
import CoinCard from "./CoinCard";
import userEvent from "@testing-library/user-event";
import { expect } from "vitest";

const mockCoin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "https://example.com/bitcoin.png",
  current_price: 5000000,
  market_cap: 10000000000,
  price_change_percentage_24h: 2.5,
};

const mocknegCoin = {
  id: "bitcoin",
  name: "Bitcoin",
  symbol: "btc",
  image: "https://example.com/bitcoin.png",
  current_price: 5000000,
  market_cap: 10000000000,
  price_change_percentage_24h: -2.5,
};

const handleClick = vi.fn();

test("shows coin name", () => {
  render(<CoinCard coin={mockCoin} index={0} onClick={() => {}}></CoinCard>);
  expect(screen.getByText("Bitcoin")).toBeInTheDocument();
});

test("shows price of  coin", () => {
  render(<CoinCard coin={mockCoin} index={0} onclick={() => {}}></CoinCard>);
  expect(screen.getByText(/50,00,000/)).toBeInTheDocument();
});

test("shows price change with color of  coin", () => {
  render(<CoinCard coin={mockCoin} index={0} onclick={() => {}}></CoinCard>);

  const badge = screen.getByText(/▲/);
  expect(badge).toHaveClass("positive");
  expect(badge).toBeInTheDocument();
});

test("shows price change with color of 'negative' coin", () => {
  render(<CoinCard coin={mocknegCoin} index={0} onclick={() => {}}></CoinCard>);
  const badge = screen.getByText(/▼/);
  expect(badge).toHaveClass("negative");
  expect(badge).toBeInTheDocument();
});


test('handle click',async ()=>{
render(<CoinCard coin={mockCoin} index={0} onClick={handleClick}></CoinCard>);
await userEvent.click(screen.getByText('Bitcoin'));
expect(handleClick).toHaveBeenCalled()
})