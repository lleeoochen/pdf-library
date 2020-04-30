---
---
class PDFLoader {

	constructor(container) {
		this.container = container;

		this.pdfDoc = null;
		this.pageNum = 1;
		this.pageRendering = false;
		this.pageNumPending = null;

		this.pdfjsLib = window['pdfjs-dist/build/pdf'];
		this.pdfjsLib.GlobalWorkerOptions.workerSrc = "{{ site.pluginUrl }}/mozilla-pdf-worker/2.4.456.js";
	}

	async load(url) {
		let self = this;

		await self.pdfjsLib.getDocument({ url: url }).promise.then(function(_pdfDoc) {
			self.pdfDoc = _pdfDoc;
			$(self.totalId).text(self.pdfDoc.numPages);

			self.renderAllPages();
		});
	}

	renderAllPages() {
		let self = this;

		for (let i = 1; i <= self.pdfDoc.numPages; i++) {
			self.pdfDoc.getPage(i).then(page => {
				self.drawCanvas(page);
			});
		}
	}

	drawCanvas(page) {
		let self = this;
		let scale = 2;

		let viewport = page.getViewport({ scale: 1 });
		let ratio = viewport.height / viewport.width;

		let canvas = document.createElement('canvas');
		canvas.className = 'pdf-page';
		canvas.setAttribute('ratio', ratio);

		canvas.height = viewport.width * ratio * scale;
		canvas.width = viewport.width * scale;

		if (SCREEN_PORTRAIT) {
			canvas.style.height = window.innerWidth * ratio + 'px';
			canvas.style.width = window.innerWidth + 'px';
		}
		else {
			canvas.style.height = window.innerHeight + 'px';
			canvas.style.width = window.innerHeight / ratio + 'px';
		}

		canvas.getContext('2d').scale(scale, scale);
		document.getElementById(self.container).append(canvas);

		var renderContext = {
			canvasContext: canvas.getContext('2d'),
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
	}

}
