import React from 'react';

export const Settings = () => {
    return <div className="container">
        <div className="page-header">
            <h1>Настройки</h1>
        </div>
        
        <form>
            <div className="form-group">
                <label htmlFor="inputAPIname">Биржа</label>
                <input type="text" className="form-control" id="inputAPIname" placeholder="binance" />
            </div>
            <div className="form-group">
                <label htmlFor="inputAPI">API</label>
                <input type="text" className="form-control" id="inputAPI" placeholder="api" />
            </div>
            <div className="form-group">
                <label htmlFor="inputAPIKey">API-key</label>
                <input type="password" className="form-control" id="inputAPI" placeholder="key" />
            </div>
            <button type="submit" className="btn btn-default">Сохранить</button>
        </form>
  </div>
}
