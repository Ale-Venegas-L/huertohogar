import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Header from "./Header";

describe("Header", () => {
  const setup = () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>
    );
  };

  it("renderiza enlaces principales", () => {
    setup();
    expect(screen.getByRole("link", { name: /home/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /catalogo/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /nosotros/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /contacto/i })).toBeTruthy();
  });

  it("renderiza acciones de usuario", () => {
    setup();
    expect(screen.getByRole("link", { name: /login/i })).toBeTruthy();
    expect(screen.getByRole("link", { name: /crear cuenta/i })).toBeTruthy();
  });

  it("muestra el estado del carrito", () => {
    setup();
    // Busca el texto "Carrito(0)" dentro del link del carrito
    expect(screen.getByText(/carrito\(0\)/i)).toBeTruthy();
  });
});
