export default function GlassCard({ children, className = '', innerClassName = '', hover = true }) {
  return (
    <div className={`shell ${hover ? '' : '[&:hover]:transform-none'} ${className}`}>
      <div className={`glass ${innerClassName}`}>{children}</div>
    </div>
  );
}
