import { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { api } from '../services/api';

interface RichTextEditorProps {
    value: string;
    onChange: (value: string) => void;
}

export const RichTextEditor = ({ value, onChange }: RichTextEditorProps) => {
    const editorRef = useRef<any>(null);

    const handleImageUpload = async (blobInfo: any, _progress: (percent: number) => void): Promise<string> => {
        return new Promise((resolve, reject) => {
            const formData = new FormData();
            formData.append('file', blobInfo.blob(), blobInfo.filename());

            api.post('upload.php', formData)
                .then(response => {
                    resolve(response.data.url);
                })
                .catch(error => {
                    reject('Falha no upload: ' + error.message);
                });
        });
    };

    return (
        <div className="rounded-lg overflow-hidden border border-gray-300">
            <Editor
                onInit={(_evt, editor) => editorRef.current = editor}
                value={value}
                onEditorChange={(newValue) => onChange(newValue)}
                init={{
                    height: 500,
                    menubar: true,
                    plugins: [
                        'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                        'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                        'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                    ],
                    toolbar: 'undo redo | blocks | ' +
                        'bold italic forecolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | image media link | help',
                    content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',

                    // Image Upload Configuration
                    images_upload_handler: handleImageUpload,
                    paste_data_images: true, // Allow pasting images directly

                    // Localization (Optional, defaults to English if not found, usually fine)
                    language: 'pt_BR',
                    // To remove the "Free API Key" warning in production one would need a key, 
                    // but for dev/local it works with a warning banner or without key.
                }}
                apiKey="z4j0cbkhk0332bnu3hqwp0uvgtr33p68hnfjvjmyyxrj5e98"
            />
        </div>
    );
};
