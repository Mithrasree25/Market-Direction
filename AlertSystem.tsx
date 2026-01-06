import React, { useState } from 'react';
import { Bell, AlertTriangle, CheckCircle, X, Settings } from 'lucide-react';

interface Alert {
  id: string;
  type: 'price' | 'prediction' | 'risk' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  severity: 'low' | 'medium' | 'high';
  read: boolean;
}

interface AlertSystemProps {
  alerts: Alert[];
  onDismissAlert: (id: string) => void;
  onMarkAsRead: (id: string) => void;
}

export const AlertSystem: React.FC<AlertSystemProps> = ({ alerts, onDismissAlert, onMarkAsRead }) => {
  const [showSettings, setShowSettings] = useState(false);
  const [alertSettings, setAlertSettings] = useState({
    priceAlerts: true,
    predictionAlerts: true,
    riskAlerts: true,
    systemAlerts: true
  });

  const unreadCount = alerts.filter(alert => !alert.read).length;

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'border-red-200 bg-red-50 text-red-800';
      case 'medium':
        return 'border-yellow-200 bg-yellow-50 text-yellow-800';
      default:
        return 'border-blue-200 bg-blue-50 text-blue-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'price':
        return <CheckCircle className="w-4 h-4" />;
      case 'prediction':
        return <Bell className="w-4 h-4" />;
      case 'risk':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Settings className="w-4 h-4" />;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold flex items-center">
          <Bell className="w-5 h-5 mr-2 text-blue-600" />
          Alert System
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </h3>
        <button
          onClick={() => setShowSettings(!showSettings)}
          className="p-2 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {showSettings && (
        <div className="mb-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Alert Settings</h4>
          <div className="space-y-2">
            {Object.entries(alertSettings).map(([key, value]) => (
              <label key={key} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(e) => setAlertSettings(prev => ({ ...prev, [key]: e.target.checked }))}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3 max-h-64 overflow-y-auto">
        {alerts.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            No alerts at this time
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getSeverityColor(alert.severity)} ${
                !alert.read ? 'ring-2 ring-blue-200' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getTypeIcon(alert.type)}
                  <div className="flex-1">
                    <h5 className="font-medium text-sm">{alert.title}</h5>
                    <p className="text-xs mt-1 opacity-75">{alert.message}</p>
                    <p className="text-xs mt-1 opacity-50">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-1">
                  {!alert.read && (
                    <button
                      onClick={() => onMarkAsRead(alert.id)}
                      className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      title="Mark as read"
                    >
                      <CheckCircle className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => onDismissAlert(alert.id)}
                    className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded"
                    title="Dismiss"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};