import { useState } from 'react';
import { useData } from '../contexts/DataContext';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, type DragEndEvent } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, GripVertical, Upload, Plus } from 'lucide-react';
import type { Promotion } from '../types';

interface SortableItemProps {
    promotion: Promotion;
    onDelete: (id: string) => void;
}

const SortableItem = ({ promotion, onDelete }: SortableItemProps) => {
    const {
        attributes,
        listeners,
        setNodeRef,
        transform,
        transition,
    } = useSortable({ id: promotion.id });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    return (
        <div ref={setNodeRef} style={style} className="bg-surface p-4 rounded-xl border border-white/10 flex items-center gap-4 mb-3 group shadow-sm hover:shadow-md transition-all">
            <div {...attributes} {...listeners} className="cursor-grab text-gray-400 hover:text-gray-600">
                <GripVertical size={20} />
            </div>

            <div className="w-16 h-24 bg-background rounded-lg overflow-hidden flex-shrink-0 border border-white/5">
                <img src={promotion.imageUrl} alt={promotion.title} className="w-full h-full object-cover" />
            </div>

            <div className="flex-1 min-w-0">
                <h4 className="font-bold text-white truncate">{promotion.title}</h4>
                {promotion.link && (
                    <p className="text-sm text-blue-600 truncate">{promotion.link}</p>
                )}
                <div className={`text-xs mt-1 inline-flex px-2 py-0.5 rounded-full ${promotion.active ? 'bg-green-100 text-green-700' : 'bg-background text-gray-600'}`}>
                    {promotion.active ? 'Ativo' : 'Inativo'}
                </div>
            </div>

            <button
                onClick={() => onDelete(promotion.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                title="Excluir"
            >
                <Trash2 size={18} />
            </button>
        </div>
    );
};

export const PromotionsManager = () => {
    const { promotions, savePromotion, deletePromotion, reorderPromotions } = useData();
    const [uploading, setUploading] = useState(false);
    const [isFormOpen, setIsFormOpen] = useState(false);

    // Form State
    const [title, setTitle] = useState('');
    const [link, setLink] = useState('');
    const [imageUrl, setImageUrl] = useState('');

    const sensors = useSensors(
        useSensor(PointerSensor),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragEnd = (event: DragEndEvent) => {
        const { active, over } = event;

        if (active.id !== over?.id) {
            const oldIndex = promotions.findIndex((p) => p.id === active.id);
            const newIndex = promotions.findIndex((p) => p.id === over?.id);

            const newOrder = arrayMove(promotions, oldIndex, newIndex);

            // Prepare update for backend
            const updates = newOrder.map((item, index) => ({
                id: item.id,
                orderIndex: index
            }));

            reorderPromotions(updates);
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('api/upload.php', {
                method: 'POST',
                body: formData
            });
            const data = await response.json();

            if (data.url) {
                setImageUrl(data.url);
            }
        } catch (error) {
            console.error('Upload failed:', error);
            alert('Falha no upload da imagem');
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageUrl) return alert('Imagem é obrigatória');

        await savePromotion({
            title: title || 'Nova Promoção',
            imageUrl,
            link,
            active: true,
            orderIndex: promotions.length
        });

        // Reset
        setTitle('');
        setLink('');
        setImageUrl('');
        setIsFormOpen(false);
    };

    const handleDelete = async (id: string) => {
        if (confirm('Tem certeza que deseja excluir esta promoção?')) {
            await deletePromotion(id);
        }
    };

    return (
        <div className="max-w-4xl">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <p className="text-gray-400 mt-1">Gerencie as imagens do encarte digital (Promoções).</p>
                </div>

                <button
                    onClick={() => setIsFormOpen(true)}
                    className="btn-primary flex items-center gap-2"
                >
                    <Plus size={20} />
                    Nova Arte
                </button>
            </div>

            {isFormOpen && (
                <div className="bg-surface p-6 rounded-2xl shadow-sm border border-white/10 mb-8 animate-in slide-in-from-top-2">
                    <h3 className="font-bold text-lg mb-4">Adicionar Nova Arte</h3>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Título (Interno)</label>
                                    <input
                                        type="text"
                                        value={title}
                                        onChange={e => setTitle(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="Ex: Oferta Fim de Semana"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link (Opcional)</label>
                                    <input
                                        type="text"
                                        value={link}
                                        onChange={e => setLink(e.target.value)}
                                        className="w-full px-4 py-2 border rounded-xl focus:ring-2 focus:ring-primary/20 outline-none"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Imagem da Arte</label>
                                <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 flex flex-col items-center justify-center text-center h-40 hover:bg-background transition-colors relative">
                                    {imageUrl ? (
                                        <div className="absolute inset-0 p-2">
                                            <img src={imageUrl} className="w-full h-full object-contain rounded-lg" />
                                            <button
                                                type="button"
                                                onClick={() => setImageUrl('')}
                                                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full shadow-md hover:bg-red-600"
                                            >
                                                <Trash2 size={14} />
                                            </button>
                                        </div>
                                    ) : (
                                        <label className="cursor-pointer w-full h-full flex flex-col items-center justify-center">
                                            {uploading ? (
                                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500/30"></div>
                                            ) : (
                                                <>
                                                    <Upload className="text-gray-400 mb-2" />
                                                    <span className="text-sm text-gray-400">Clique para selecionar</span>
                                                    <span className="text-xs text-gray-400 mt-1">WebP, PNG ou JPG</span>
                                                </>
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                className="hidden"
                                                onChange={handleFileUpload}
                                                disabled={uploading}
                                            />
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-2">
                            <button
                                type="button"
                                onClick={() => setIsFormOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800"
                            >
                                Cancelar
                            </button>
                            <button
                                type="submit"
                                disabled={!imageUrl || uploading}
                                className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-600/90 disabled:opacity-50"
                            >
                                Salvar Arte
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <DndContext
                sensors={sensors}
                collisionDetection={closestCenter}
                onDragEnd={handleDragEnd}
            >
                <SortableContext
                    items={promotions.map(p => p.id)}
                    strategy={verticalListSortingStrategy}
                >
                    <div className="space-y-3">
                        {promotions.map((promotion) => (
                            <SortableItem key={promotion.id} promotion={promotion} onDelete={handleDelete} />
                        ))}
                    </div>
                </SortableContext>
            </DndContext>

            {promotions.length === 0 && !isFormOpen && (
                <div className="text-center py-20 bg-background rounded-2xl border border-dashed border-gray-300">
                    <p className="text-gray-400">Nenhuma promoção cadastrada.</p>
                    <button onClick={() => setIsFormOpen(true)} className="text-blue-400 font-bold mt-2 hover:underline">
                        Adicionar a primeira
                    </button>
                </div>
            )}
        </div>
    );
};
