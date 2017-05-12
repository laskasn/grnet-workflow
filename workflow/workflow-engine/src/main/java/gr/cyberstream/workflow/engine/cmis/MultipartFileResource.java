package gr.cyberstream.workflow.engine.cmis;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;

import org.apache.chemistry.opencmis.client.api.Document;
import org.springframework.core.io.InputStreamResource;

public class MultipartFileResource extends InputStreamResource {

	private String filename;
	private Long length;

	public MultipartFileResource(Document document) {
		super(document.getContentStream().getStream());
		// String extension = MimeTypes.getExtension(document.getContentStreamMimeType());
		//this.filename = document.getContentStream().getFileName() + extension;
		this.filename = document.getContentStream().getFileName();
		this.length = document.getContentStream().getLength();
	}

	@Override
	public String getFilename() {

		try {
			return URLEncoder.encode(this.filename, "UTF-8");

		} catch (UnsupportedEncodingException e) {
			e.printStackTrace();
		}

		return this.filename;
	}

	@Override
	public long contentLength() {
		return this.length;
	}

}
