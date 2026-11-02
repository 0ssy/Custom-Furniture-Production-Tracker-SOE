// Temporary page shown for modules we haven't built yet.
// "title" is a prop, meaning the parent (App.tsx) tells this page what to display.
type Props = {
  title: string
}

function PagePlaceholder({ title }: Props) {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{title}</h2>
      <p className="text-gray-600">This page is coming soon.</p>
    </div>
  )
}

export default PagePlaceholder