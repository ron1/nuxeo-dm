var nuxeo = nuxeo || {}

nuxeo.lightbox = (function(m) {

  var currentLocale;

  function getCurrentLocale() {
    if (undefined == currentLocale) {
      currentLocale = jQuery.cookie('org.jboss.seam.core.Locale');
    }
    return currentLocale;
  }

  function formatDocWithPicture(doc, img) {
    var creationDate = new Date(doc.properties['dc:created']);
    var markup = '<div class="mfp-figure">'
        + '<figure><img class="mfp-img" src="'
        + img
        + '" style="max-width:'
        + (jQuery(window).width() - 120)
        + 'px;max-height:'
        + (jQuery(window).height() - 80)
        + 'px"><figcaption>'
        + '<div class="mfp-bottom-bar"><div class="mfp-title">'
        + doc.title
        + '<small>'
        + (doc.properties['dc:description'] === null ? ''
            : doc.properties['dc:description'])
        + '</small></div><div class="mfp-counter">'
        + doc.properties['dc:creator'] + ' '
        + creationDate.toLocaleDateString(getCurrentLocale()) + '</div>'
        + '</div></figcaption></figure></div>';

    return markup;
  }
  ;

  m.requestedSchema = 'dublincore, common, picture';

  m.setRequestHeaders = function(request) {
    request.setRequestHeader("X-NXDocumentProperties",
        nuxeo.lightbox.requestedSchema);
  };

  m.formatDefaultDoc = function(doc) {
    return formatDocWithPicture(doc, nxContextPath + '/img/empty_picture.png');
  };

  m.formatPictureDoc = function(doc) {
    return formatDocWithPicture(doc,
        doc.properties['picture:views'][4].content.data);
  };

  m.formatUnknownDoc = function(doc) {
    var markup = '<div>' + '<h3>Not supported yet!</h3>' + '<div>';
    return markup;
  }

  m.formatVideoDoc = function(doc) {
    return formatDocWithPicture(doc, '/nuxeo/img/empty_picture.png');
  }

  m.formatDoc = function(doc) {
    if (doc.facets.indexOf('MultiviewPicture') > -1) {
      return nuxeo.lightbox.formatPictureDoc(doc);
    } else if (doc.facets.indexOf('Video') > -1) {
      return nuxeo.lightbox.formatVideoDoc(doc);
    } else if (doc.facets.indexOf('Thumbnail') > -1) {
      return nuxeo.lightbox.formatDefaultDoc(doc);
    } else {
      return nuxeo.lightbox.formatUnknownDoc(doc);
    }
  }

  return m;

}(nuxeo.lightbox || {}));