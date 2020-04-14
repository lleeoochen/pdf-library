---
---
class PDFLoader {

	constructor(canvasId, prevId, nextId, countId, totalId) {
		this.canvasId = canvasId;
		this.prevId = prevId;
		this.nextId = nextId;
		this.countId = countId;
		this.totalId = totalId;

		this.pdfDoc = null;
		this.pageNum = 1;
		this.pageRendering = false;
		this.pageNumPending = null;
		this.canvas = document.getElementById(canvasId)

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

		self.pdfjsLib.getDocument({
			url: url,
			// httpHeaders: {
			// 	'Access-Control-Allow-Origin': 'https://firebasestorage.googleapis.com',
			// 	'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept, Authorization',
			// 	"Access-Control-Allow-Credentials": true
			// },
			// withCredentials: false
		}).promise.then(function(_pdfDoc) {
			self.pdfDoc = _pdfDoc;
			$(self.totalId).text(self.pdfDoc.numPages);

			self.renderPage(self.pageNum);
		});
	}

	renderPage(num) {
		let self = this;

		self.pageRendering = true;
		self.pdfDoc.getPage(num).then(page => {
			let viewport = page.getViewport({ scale: 1 });

			self.canvas.height = viewport.height * 4;
			self.canvas.width = viewport.width * 4;
			self.canvas.style.height = viewport.height + 'px';
			self.canvas.style.width = viewport.width + 'px';
			self.canvas.getContext('2d').scale(4, 4);

			var renderContext = {
				canvasContext: this.canvas.getContext('2d'),
				viewport: viewport
			};
			var renderTask = page.render(renderContext);

			renderTask.promise.then(() => {
				self.pageRendering = false;
				if (self.pageNumPending !== null) {
					self.renderPage(self.pageNumPending);
					self.pageNumPending = null;
				}
			});
		});

		$(self.countId).text(num);
	}

	queueRenderPage(num) {
		let self = this;

		if (self.pageRendering)
			self.pageNumPending = num;
		else
			self.renderPage(num);
	}

	prevPage() {
		let self = this;

		if (self.pageNum > 1) {
			self.pageNum--;
			self.queueRenderPage(self.pageNum);
		}
	}

	nextPage() {

		let self = this;
		if (self.pageNum < self.pdfDoc.numPages) {
			self.pageNum++;
			self.queueRenderPage(self.pageNum);
		}
	}
}
