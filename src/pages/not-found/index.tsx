import routes from "../../configs/routes";
import NotFoundStyled from "./NotFound";

function NotFound() {
  return (
    <NotFoundStyled>
      <div className="container">
        <h1>404</h1>
        <p>
          No page found
          <br />
          <br />
          <a href={routes.landing}>Go home</a>
        </p>
      </div>
    </NotFoundStyled>
  );
}

export default NotFound;
