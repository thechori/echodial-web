import { styled } from "styled-components";
//
import devices from "../../styles/devices";

const SignUpStyled = styled.div`
  width: 100vw;
  min-height: 100vh;
  background: linear-gradient(
      129deg,
      rgba(242, 47, 70, 0.85),
      rgba(0, 140, 255, 0.85)
    ),
    url(img/try-bg.png) 50% 50% no-repeat;

  background-size: cover;

  .header {
    font-weight: 200;

    padding-top: 2rem;
    padding-bottom: 2rem;

    @media ${devices.tablet} {
      font-size: 2.25rem;
      padding-top: 4rem;
      padding-bottom: 3rem;
    }
  }

  .card {
    margin-left: auto;
    margin-right: auto;
    display: block;

    @media ${devices.tablet} {
      display: flex;
      max-width: 780px;
    }

    .left {
      background: linear-gradient(304deg, hsla(0, 0%, 100%, 0.4), #fff);
      border-top-left-radius: 6px;
      border-bottom-left-radius: 6px;

      display: none;

      @media ${devices.tablet} {
        display: flex;
        flex: 1;
        width: 45%;
      }

      .value-proposition {
        padding: 40px 55px 75px 55px;

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

      padding: 2rem;

      @media ${devices.tablet} {
        padding: 40px 50px 30px 50px;
        border-top-right-radius: 6px;
        border-bottom-right-radius: 6px;
        flex: 1;
        width: 55%;
      }
    }
  }

  .logo-container {
    img {
      width: 200px;

      @media ${devices.tablet} {
        width: 300px;
      }
    }
  }

  .lower-lower-links {
    padding: 2rem;

    @media ${devices.tablet} {
      padding: 3rem;
      width: 400px;
    }
  }
`;

export default SignUpStyled;
