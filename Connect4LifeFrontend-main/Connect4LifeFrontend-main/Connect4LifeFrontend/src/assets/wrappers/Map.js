import styled from 'styled-components'

const Wrapper = styled.div`
  background-color: #f4f4f4;

  .tasks-status {
    margin-bottom: 0px;
  }

  .title {
    margin-bottom: 700px;
    font-size: 40px;
    text-align: center;
    justify-content: center;
    color: #333;
    font-family: 'Tahoma', sans-serif;
    text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.1);
    padding: 20px;
    background-color: #f0f0f0;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    margin: 20px auto;
    max-width: 80%;
  }

  .overview-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 80vh;
    background-color: #f4f4f4;
    width: 100%;
    padding: -60px;
  }

  .map-area {
    z-index: 1;
    margin-top: 0px;
    margin-left: -250px;
    width: 50%;
    height: 70%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    box-shadow: 0 4px 8px black;
    border: 3px solid black;
    border-radius: 40px;
  }

  .task-area {
    padding: 10px;
    display: flex;
    flex-direction: column;
    height: 55vh;
    width: 50vh;
    background-color: #fff;
    border-radius: 20px;
    border: 1px solid;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
    margin-left: 100px;
    background-color: #a3c2c2;
  }
  .overview-container {
    position: relative;
  }

  .map-area {
    position: relative;
    height: 600px; /* Adjust height as needed */
  }

  .task-details-overlay {
    position: absolute;
    top: 0;
    right: 0;
    width: 30%;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 20px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    z-index: 1000;
  }
`

export default Wrapper
