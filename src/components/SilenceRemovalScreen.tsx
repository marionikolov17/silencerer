import styles from './SilenceRemovalScreen.module.css';

export default function SilenceRemovalScreen() {
  return (
    <div className="absolute top-0 left-0 z-50 w-full h-full flex items-center justify-center bg-blue-500/50">
      <div
        className={styles.loader}
        style={
          { '--loader-text': `'Removing silence...'` } as React.CSSProperties
        }
      ></div>
    </div>
  );
}
