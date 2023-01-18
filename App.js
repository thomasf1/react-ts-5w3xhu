//import './App.css';
import styles from './styles.module.css';
import React from 'react';
import Deck from './Deck.js';

export default function App() {
  return (
    <div className={`flex fill center ${styles.container}`}>
      <Deck />
    </div>
  );
}
