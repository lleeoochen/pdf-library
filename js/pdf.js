---
---
class PDFLoader {

	constructor(canvasBoxId, prevId, nextId, countId, totalId) {
		this.canvasBoxId = canvasBoxId;
		this.prevId = prevId;
		this.nextId = nextId;
		this.countId = countId;
		this.totalId = totalId;

		this.pdfDoc = null;
		this.pageNum = 1;
		this.pageRendering = false;
		this.pageNumPending = null;

		this.pdfjsLib = window['pdfjs-dist/build/pdf'];
		this.pdfjsLib.GlobalWorkerOptions.workerSrc = '//mozilla.github.io/pdf.js/build/pdf.worker.js';

		let self = this;
		$(this.prevId).on('click', () => {
			self.prevPage();
		});

		$(this.nextId).on('click', () => {
			self.nextPage();
		});
	}

	load(url) {
		let self = this;

		self.pdfjsLib.getDocument({ url: url }).promise.then(function(_pdfDoc) {
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
		document.getElementById(self.canvasBoxId).append(canvas);

		var renderContext = {
			canvasContext: canvas.getContext('2d'),
			viewport: viewport
		};
		var renderTask = page.render(renderContext);
	}

	prevPage() {
		let self = this;

		// if (self.pageNum > 1) {
		// 	self.pageNum--;
		// 	self.queueRenderPage(self.pageNum);
		// }
	}

	nextPage() {
		let self = this;

		// if (self.pageNum < self.pdfDoc.numPages) {
		// 	self.pageNum++;
		// 	self.queueRenderPage(self.pageNum);
		// }
	}
}
