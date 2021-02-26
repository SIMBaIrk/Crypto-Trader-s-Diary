import React, { Fragment } from 'react';

export const TradesClosed = () => {
    return (
        <div className="panel panel-default">
        <div className="panel-heading">Завершенные сделки</div>
            <table className="table">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Инструмент</th>
                        <th>Дата</th>
                        <th>П/У</th>
                        <th>П/У %</th>
                    </tr>
                </thead>
                <tbody>
                    <tr className="success">
                        <th scope="row">1</th>
                        <td>BTCUSDT</td>
                        <td>01010122</td>
                        <td>01010122</td>
                        <td>01010122</td>
                    </tr>
                    <tr className="danger">
                        <th scope="row">2</th>
                        <td>BTCUSDT</td>
                        <td>01010122</td>
                        <td>01010122</td>
                        <td>01010122</td>
                    </tr>
                </tbody>
            </table>
    </div>
    )
}

export const TradesOpen = () => {
    return(
    <div className="panel panel-default">
    <div className="panel-heading">Открытые сделки</div>
        <table className="table">
            <thead>
                <tr>
                    <th>#</th>
                    <th>Инструмент</th>
                    <th>Дата</th>
                    <th>П/У</th>
                    <th>П/У %</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <th scope="row">1</th>
                    <td>BTCUSDT</td>
                    <td>01010122</td>
                    <td>01010122</td>
                    <td>01010122</td>
                </tr>
               </tbody>
        </table>
  </div>)
}

export const TradeBody = ({user}) => {
    return(<Fragment>
        {user ? (<p>вы вошли как пользователь {user.username}</p>):(
        <div>
            <p>Ниже пример как будут выглядеть сделки.</p>
            <p>просто сделай ещё один хороший трейд</p>
            <TradesOpen />
            <TradesClosed />
        </div>
        )
        }
        </Fragment>
    );
}