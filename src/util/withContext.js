// Do something with the canvas context and revert it to its previous state
const withContext = (context, fn) => {
    context.save()
    fn(context)
    context.restore()
}

export default withContext
