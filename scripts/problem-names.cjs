/** Match the descriptive folder/class convention used by the original problems. */
function problemNames(title) {
  const slug = title.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  const className = slug.split('-').map(word => word[0].toUpperCase() + word.slice(1)).join('') + 'ProblemComponent';
  return { slug, className };
}
module.exports = { problemNames };
