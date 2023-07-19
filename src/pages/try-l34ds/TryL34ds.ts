import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const TryL34dsStyled = styled.div`
  width: 100vw;
  height: 100vh;

  background: linear-gradient(
      129deg,
      rgba(242, 47, 70, 0.85),
      rgba(0, 140, 255, 0.85)
    ),
    url(img/try-bg.png) 50% 50% no-repeat;

  background-size: cover;

  .header {
    color: white;
    font-weight: 200;

    padding-top: 2rem;

    @media ${devices.tablet} {
      font-size: 2.25rem;
      padding-top: 4rem;
    }

    .title {
      text-align: center;

      margin-bottom: 3rem;
    }
  }

  .card {
    display: flex;
    margin-left: auto;
    margin-right: auto;

    @media ${devices.tablet} {
      max-width: 780px;
    }

    .left {
      width: 45%;
      flex: 1;
      background: linear-gradient(304deg, hsla(0, 0%, 100%, 0.4), #fff);
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;

      .value-proposition {
        padding: 75px 55px;

        .title {
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .items {
          .item {
            display: flex;
            align-items: center;
            font-size: 1.1rem;
            margin-bottom: 0.5rem;

            span {
              margin-left: 0.5rem;
            }
          }
        }
      }
    }

    .right {
      background-color: white;
      flex: 1;
      width: 55%;
      padding: 30px 50px;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  .logo-container {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-bottom: 2rem;

    img {
      width: 200px;

      @media ${devices.tablet} {
        width: 300px;
      }
    }
  }

  .legal {
    display: flex;

    input {
      margin-right: 0.5rem;
    }

    label {
      font-size: 0.85rem;
    }
  }

  .error {
    margin-bottom: 1rem;
  }

  .lower-links {
    display: flex;
    justify-content: space-between;
  }

  .lower-lower-links {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: white;
    margin: auto;
    width: 300px;
    padding: 3rem;
  }
`;

export default TryL34dsStyled;
